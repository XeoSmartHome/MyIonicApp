package Models

type ReservationRequest struct {
	LocationId  int    `json:"locationId"`
	TreatmentId int    `json:"treatmentId"`
	Date        int    `json:"date"`
	ClientName  string `json:"clientName"`
	ClientCNP   string `json:"clientCNP"`
}
