package main

import (
	"PPD-Server-Client/Const"
	"PPD-Server-Client/Models"
	"encoding/json"
	"fmt"
	"github.com/mitchellh/mapstructure"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net"
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

func main() {
	waitChan := make(chan Job)
	count := 0

	db := ConnectToDatabase("mongodb://localhost:27017")

	l, err := net.Listen("tcp", "127.0.0.1:8080") // set listen port
	if err != nil {
		log.Fatal("Error listening: ", err)
	}
	defer l.Close()

	//for i := 0; i < ThreadsCount-1; i++ {
	go startThread(1, waitChan, db)
	//}

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
	fmt.Println("Thread", threadId, "handling connection")

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

	fmt.Println("Request", genericRequest)
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

	startCAndVremSaPunem := reservationRequest.Date
	endCanVremSaPunem := reservationRequest.Date + treatment.Duration

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
		return
	}

	var reservations []Models.Reservation
	if err = cursor.All(nil, &reservations); err != nil {
		fmt.Println("Error decoding reservations", err)
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
			return
		}

		_, err = conn.Write(responseBytes)
		if err != nil {
			log.Fatal("Error writing:", err)
			return
		}

		return
	}

	insertResult, err := db.Collection("Reservations").InsertOne(nil, Models.Reservation{
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
		return
	}

	fmt.Println("Inserted reservation with id", insertResult.InsertedID)

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

	insertOneResult, err := db.Collection("Payments").InsertOne(nil, Models.Payment{
		Id:     primitive.NilObjectID,
		Date:   primitive.NewDateTimeFromTime(time.Now()),
		CNP:    paymentRequest.ClientCNP,
		Amount: paymentRequest.Amount,
	})

	if err != nil {
		fmt.Println("Error inserting payment", err)
		return
	}

	fmt.Println("Inserted payment with id", insertOneResult.InsertedID)

}

func handleCancelation(conn net.Conn, db *mongo.Database, cancelationRequest Models.CancelationRequest) {
	fmt.Println("Cancelation request", cancelationRequest)

	_, err := db.Collection("Reservations").DeleteOne(nil, bson.M{
		"cnp": cancelationRequest.ClientCNP,
	})

	if err != nil {
		fmt.Println("Error deleting reservation", err)
		return
	}

	insertOneResult, err := db.Collection("Payments").InsertOne(nil, Models.Payment{
		Id:     primitive.NilObjectID,
		Date:   primitive.NewDateTimeFromTime(time.Now()),
		CNP:    cancelationRequest.ClientCNP,
		Amount: -cancelationRequest.Amount,
	})

	if err != nil {
		fmt.Println("Error inserting payment", err)
		return
	}

	fmt.Println("Deleted reservation and inserted payment with id", insertOneResult.InsertedID)
}
