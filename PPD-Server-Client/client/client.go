package main

import (
	"PPD-Server-Client/Const"
	"PPD-Server-Client/Models"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net"
	"strconv"
	"time"
)

const ServerUrl = "127.0.0.1:8080"

func main() {
	source := rand.NewSource(time.Now().Unix())
	random := rand.New(source)

	for {
		time.Sleep(2 * time.Second)

		location := Const.Locations[random.Intn(len(Const.Locations))]
		locationId := location.Id
		treatmentId := location.Treatments[random.Intn(len(location.Treatments))].Id
		date := random.Intn(8 * 60)
		clientName := "Client " + strconv.Itoa(random.Intn(100))
		clientCNP := strconv.Itoa(random.Intn(1000000000000))
		willCancel := random.Intn(100) < 50

		fmt.Println("Making reservation for " + clientName + " at " + strconv.Itoa(date) + " for treatment " + strconv.Itoa(treatmentId) + " at location " + strconv.Itoa(locationId))
		cost := makeReservation(locationId, treatmentId, date, clientName, clientCNP)

		if cost == 0 {
			continue
		}

		time.Sleep(1 * time.Second)

		payReservation(locationId, treatmentId, clientCNP, cost)

		if !willCancel {
			continue
		}

		time.Sleep(1 * time.Second)

		cancelReservation(locationId, treatmentId, clientCNP, cost)
	}

}

func makeReservation(locationId int, treatmentId int, date int, clientName string, clientCNP string) int {
	conn, err := net.Dial("tcp", ServerUrl)
	if err != nil {
		fmt.Println("Error connecting to server")
		return 0
	}

	reservationRequest := Models.ReservationRequest{
		LocationId:  locationId,
		TreatmentId: treatmentId,
		Date:        date,
		ClientName:  clientName,
		ClientCNP:   clientCNP,
	}

	genericRequest := Models.GenericRequest{
		Event: "reservation",
		Data:  reservationRequest,
	}

	requestBinary, err := json.Marshal(genericRequest)

	if err != nil {
		fmt.Println("Error marshalling request")
		return 0
	}

	_, err = conn.Write(requestBinary)
	if err != nil {
		fmt.Println("Error writing to server")
		return 0
	}

	buf := make([]byte, 1024)
	read, err := conn.Read(buf)

	if err != nil {
		log.Fatal("error reading response")
	}

	var response Models.ReservationResponse
	err = json.Unmarshal(buf[:read], &response)

	if err != nil {
		log.Fatal("error unmarshalling response")
	}

	if response.Success {
		fmt.Println("Reservation successful")
	} else {
		fmt.Println("Reservation failed")
		return 0
	}

	return response.Cost
}

func payReservation(locationId int, treatmentId int, clientCNP string, amount int) bool {
	fmt.Println("Paying reservation")

	conn, err := net.Dial("tcp", ServerUrl)
	if err != nil {
		fmt.Println("Error connecting to server")
		return false
	}

	paymentRequest := Models.PaymentRequest{
		ClientCNP:   clientCNP,
		Amount:      amount,
		LocationId:  locationId,
		TreatmentId: treatmentId,
	}

	genericRequest := Models.GenericRequest{
		Event: "payment",
		Data:  paymentRequest,
	}

	requestBinary, err := json.Marshal(genericRequest)

	if err != nil {
		fmt.Println("Error marshalling request")
		return false
	}

	_, err = conn.Write(requestBinary)

	if err != nil {
		fmt.Println("Error writing to server")
		return false
	}

	return true
}

func cancelReservation(locationId int, treatmentId int, clientCNP string, amount int) bool {
	fmt.Println("Cancelling reservation")

	conn, err := net.Dial("tcp", ServerUrl)
	if err != nil {
		fmt.Println("Error connecting to server")
		return false
	}

	cancelRequest := Models.CancelationRequest{
		ClientCNP:   clientCNP,
		Amount:      amount,
		LocationId:  locationId,
		TreatmentId: treatmentId,
	}

	genericRequest := Models.GenericRequest{
		Event: "cancelation",
		Data:  cancelRequest,
	}

	requestBinary, err := json.Marshal(genericRequest)

	if err != nil {
		fmt.Println("Error marshalling request")
		return false
	}

	_, err = conn.Write(requestBinary)

	if err != nil {
		fmt.Println("Error writing to server")
		return false
	}

	return true
}
