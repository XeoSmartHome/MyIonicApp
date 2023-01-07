package main

import (
	"PPD-Server-Client/Const"
	"PPD-Server-Client/Models"
	"PPD-Server-Client/utils"
	"encoding/json"
	"fmt"
	"github.com/mitchellh/mapstructure"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net"
	"os"
	"sync"
	"time"
)

const ThreadsCount = 10

type Job struct {
	Conn net.Conn
}

func ConnectToDatabase(connectionUri string) *mongo.Database {
	client, err := mongo.Connect(nil, options.Client().ApplyURI(connectionUri))
	if err != nil {
		panic(err)
	}
	return client.Database("PPD")
}

var reservationMutex = sync.Mutex{}
var verificationMutex = sync.Mutex{}

func main() {
	waitChan := make(chan Job)
	count := 0

	db := ConnectToDatabase("mongodb://localhost:27017")

	l, err := net.Listen("tcp", "127.0.0.1:8080") // set listen port
	if err != nil {
		log.Fatal("Error listening: ", err)
	}
	defer l.Close()

	for i := 0; i < ThreadsCount-1; i++ {
		go startThread(i, waitChan, db)
	}

	startVerificationThread(db)

	for {
		count++
		if conn, err := l.Accept(); err != nil {
			log.Fatal("Error accepting: ", err)
		} else {
			waitChan <- Job{
				Conn: conn,
			}
		}
	}
}

func startThread(id int, waitChan chan Job, db *mongo.Database) {
	for {
		request := <-waitChan
		go handleConnection(id, request, db)
	}
}

func getLocationById(locationId int) *Models.Location {
	for _, location := range Const.Locations {
		if location.Id == locationId {
			return &location
		}
	}
	return nil
}

func getTreatmentById(location *Models.Location, treatmentId int) *Models.Treatment {
	for _, treatment := range location.Treatments {
		if treatment.Id == treatmentId {
			return &treatment
		}
	}
	return nil
}

func handleConnection(threadId int, job Job, db *mongo.Database) {
	//fmt.Println("Thread", threadId, "handling connection")

	conn := job.Conn

	defer conn.Close()

	buf := make([]byte, 1024)
	read, err := conn.Read(buf)

	if err != nil {
		fmt.Println("Error reading:", err.Error())
		return
	}

	var genericRequest Models.GenericRequest

	err = json.Unmarshal(buf[:read], &genericRequest)

	if err != nil {
		fmt.Println("Error unmarshalling request", err)
		return
	}

	//fmt.Println("Request", genericRequest)
	switch genericRequest.Event {
	case "reservation":
		//reservationRequest := genericRequest.Data.(Models.ReservationRequest)
		var reservationRequest Models.ReservationRequest
		err = mapstructure.Decode(genericRequest.Data, &reservationRequest)
		if err != nil {
			fmt.Println("Error decoding reservation request", err)
			return
		}
		handleReservation(conn, db, reservationRequest)
		break
	case "payment":
		//paymentRequest := genericRequest.Data.(Models.PaymentRequest)
		var paymentRequest Models.PaymentRequest
		err = mapstructure.Decode(genericRequest.Data, &paymentRequest)
		if err != nil {
			fmt.Println("Error decoding payment request", err)
			return
		}
		handlePayment(conn, db, paymentRequest)
		break
	case "cancelation":
		//cancelationRequest := genericRequest.Data.(Models.CancelationRequest)
		var cancelationRequest Models.CancelationRequest
		err = mapstructure.Decode(genericRequest.Data, &cancelationRequest)
		if err != nil {
			fmt.Println("Error decoding cancelation request", err)
			return
		}
		handleCancelation(conn, db, cancelationRequest)
	}

}

func handleReservation(conn net.Conn, db *mongo.Database, reservationRequest Models.ReservationRequest) {
	location := getLocationById(reservationRequest.LocationId)

	if location == nil {
		fmt.Println("Location not found")
		return
	}

	treatment := getTreatmentById(location, reservationRequest.TreatmentId)

	if treatment == nil {
		fmt.Println("Treatment not found")
		return
	}

	if reservationRequest.Date+treatment.Duration > 8*60 {
		//fmt.Println("Reservation not available")
		response := Models.ReservationResponse{
			Success: false,
			Message: "Programare nereusita!",
		}

		responseBytes, err := json.Marshal(response)

		if err != nil {
			fmt.Println("Error marshalling response", err)
			return
		}

		_, err = conn.Write(responseBytes)
		if err != nil {
			log.Fatal("Error writing:", err)
			return
		}
		return
	}

	startCAndVremSaPunem := reservationRequest.Date
	endCanVremSaPunem := reservationRequest.Date + treatment.Duration

	reservationMutex.Lock()

	filter := bson.M{
		"locationId":  reservationRequest.LocationId,
		"treatmentId": reservationRequest.TreatmentId,
		"$or": []bson.M{
			{
				"treatmentStart": bson.M{
					"$gte": startCAndVremSaPunem,
					"$lte": endCanVremSaPunem,
				},
			},
			{
				"treatmentEnd": bson.M{
					"$gte": startCAndVremSaPunem,
					"$lte": endCanVremSaPunem,
				},
			},
		},
	}
	cursor, err := db.Collection("Reservations").Find(nil, filter)
	if err != nil {
		fmt.Println("Error finding reservations", err)
		reservationMutex.Unlock()
		return
	}

	var reservations []Models.Reservation
	if err = cursor.All(nil, &reservations); err != nil {
		fmt.Println("Error decoding reservations", err)
		reservationMutex.Unlock()
		return
	}

	//fmt.Println("Found reservations", reservations)
	//fmt.Println(len(reservations), treatment.Capacity)

	if len(reservations) >= treatment.Capacity {
		//fmt.Println("Reservation not available")
		response := Models.ReservationResponse{
			Success: false,
			Message: "Programare nereusita!",
		}

		responseBytes, err := json.Marshal(response)

		if err != nil {
			fmt.Println("Error marshalling response", err)
			reservationMutex.Unlock()
			return
		}

		_, err = conn.Write(responseBytes)
		if err != nil {
			log.Fatal("Error writing:", err)
			reservationMutex.Unlock()
			return
		}
		reservationMutex.Unlock()
		return
	}

	_, err = db.Collection("Reservations").InsertOne(nil, Models.Reservation{
		Id:             primitive.NilObjectID,
		Client:         reservationRequest.ClientName,
		CNP:            reservationRequest.ClientCNP,
		CreatedAt:      primitive.NewDateTimeFromTime(time.Now()),
		TreatmentStart: startCAndVremSaPunem,
		TreatmentEnd:   endCanVremSaPunem,
		TreatmentId:    reservationRequest.TreatmentId,
		LocationId:     reservationRequest.LocationId,
	})

	if err != nil {
		//fmt.Println("Error inserting reservation", err)
		reservationMutex.Unlock()
		return
	}

	reservationMutex.Unlock()

	//fmt.Println("Inserted reservation with id", insertResult.InsertedID)

	response := Models.ReservationResponse{
		Success: true,
		Message: "Programare reusita!",
		Cost:    treatment.Price,
	}

	responseBytes, err := json.Marshal(response)

	if err != nil {
		fmt.Println("Error marshalling response", err)
		return
	}

	_, err = conn.Write(responseBytes)
	if err != nil {
		log.Fatal("Error writing:", err)
		return
	}
}

func handlePayment(conn net.Conn, db *mongo.Database, paymentRequest Models.PaymentRequest) {
	fmt.Println("Payment request", paymentRequest)

	_, err := db.Collection("Payments").InsertOne(nil, Models.Payment{
		Id:          primitive.NilObjectID,
		Date:        primitive.NewDateTimeFromTime(time.Now()),
		CNP:         paymentRequest.ClientCNP,
		Amount:      paymentRequest.Amount,
		LocationId:  paymentRequest.LocationId,
		TreatmentId: paymentRequest.TreatmentId,
	})

	if err != nil {
		fmt.Println("Error inserting payment", err)
		return
	}

	//fmt.Println("Inserted payment with id", insertOneResult.InsertedID)
}

func handleCancelation(conn net.Conn, db *mongo.Database, cancelationRequest Models.CancelationRequest) {
	fmt.Println("Cancelation request", cancelationRequest)
	verificationMutex.Lock()

	_, err := db.Collection("Reservations").DeleteOne(nil, bson.M{
		"cnp": cancelationRequest.ClientCNP,
	})

	if err != nil {
		fmt.Println("Error deleting reservation", err)
		return
	}

	_, err = db.Collection("Payments").InsertOne(nil, Models.Payment{
		Id:          primitive.NilObjectID,
		Date:        primitive.NewDateTimeFromTime(time.Now()),
		CNP:         cancelationRequest.ClientCNP,
		Amount:      -cancelationRequest.Amount,
		LocationId:  cancelationRequest.LocationId,
		TreatmentId: cancelationRequest.TreatmentId,
	})

	verificationMutex.Unlock()

	if err != nil {
		fmt.Println("Error inserting payment", err)
		return
	}

	//fmt.Println("Deleted reservation and inserted payment with id", insertOneResult.InsertedID)
}

func startVerificationThread(db *mongo.Database) {
	file, err := os.Create("output/verification.txt")

	if err != nil {
		fmt.Println("Error creating file", err)
		return
	}

	go func() {
		for {
			time.Sleep(5 * time.Second)
			verifyReservations(db, file)
		}
	}()
}

func verifyReservations(db *mongo.Database, file *os.File) {

	fmt.Println("Verifying reservations")
	verificationMutex.Lock()

	for _, location := range Const.Locations {
		paymentsFilter := bson.M{
			"locationId": location.Id,
		}

		paymentsCursor, err := db.Collection("Payments").Find(nil, paymentsFilter)

		if err != nil {
			fmt.Println("Error finding payments", err)
			verificationMutex.Unlock()
			continue
		}

		var payments []Models.Payment
		err = paymentsCursor.All(nil, &payments)
		if err != nil {
			fmt.Println("Error decoding payments", err)
			verificationMutex.Unlock()
			return
		}

		noConflicts := true
		var unpaidReservations []Models.Reservation
		var treatmentReservationsDetails []string

		for _, treatment := range location.Treatments {

			filter := bson.M{
				"locationId":  location.Id,
				"treatmentId": treatment.Id,
			}

			opt := options.Find().SetSort(bson.D{{"treatmentStart", 1}})

			cursor, err := db.Collection("Reservations").Find(nil, filter, opt)

			if err != nil {
				fmt.Println("Error finding reservations", err)
				verificationMutex.Unlock()
				continue
			}

			var reservations []Models.Reservation
			err = cursor.All(nil, &reservations)
			if err != nil {
				fmt.Println("Error decoding reservations", err)
				verificationMutex.Unlock()
				return
			}

			for _, reservation := range reservations {
				concurrentReservations := 0
				for _, nextReservation := range reservations {
					if nextReservation.TreatmentStart >= reservation.TreatmentStart && nextReservation.TreatmentStart <= reservation.TreatmentEnd {
						concurrentReservations++
					}
				}

				if concurrentReservations > treatment.Capacity {
					//fmt.Println("Detected reservation overflow", reservation)
					noConflicts = false
				}

				//fmt.Println(concurrentReservations)

				isPaid := false
				for _, payment := range payments {
					if payment.CNP == reservation.CNP {
						isPaid = true
						break
					}
				}

				if !isPaid {
					unpaidReservations = append(unpaidReservations, reservation)
				}

				treatmentReservationsDetails = append(treatmentReservationsDetails, fmt.Sprintf("Treatment: %d: %d/%d Time interval %s-%s\n", treatment.Id, concurrentReservations, treatment.Capacity, utils.FormatTime(reservation.TreatmentStart), utils.FormatTime(reservation.TreatmentEnd)))
			}

		}

		sold := 0

		for _, payment := range payments {
			sold += payment.Amount
		}

		conflicts := "No conflicts detected"
		if !noConflicts {
			conflicts = "Detected reservation overflow"
		}
		_, _ = file.WriteString(fmt.Sprintf("Time: %s, Location: '%s', Conflicts: '%s', Sold: %d,\n", time.Now().String(), location.Name, conflicts, sold))
		_, _ = file.WriteString("Unpaid reservations:\n")
		for _, unpaidReservation := range unpaidReservations {
			_, _ = file.WriteString(fmt.Sprintf("CNP: %s, Treatment: %d, Start: %d, End: %d\n", unpaidReservation.CNP, unpaidReservation.TreatmentId, unpaidReservation.TreatmentStart, unpaidReservation.TreatmentEnd))
		}
		for _, treatmentReservationsDetail := range treatmentReservationsDetails {
			_, _ = file.WriteString(treatmentReservationsDetail)
		}
		_, _ = file.WriteString("\n")

	}

	_, _ = file.WriteString("----------------------------------------\n")

	verificationMutex.Unlock()

}
