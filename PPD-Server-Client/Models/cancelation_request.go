package Models

type CancelationRequest struct {
	ClientCNP   string `json:"clientCNP"`
	Amount      int    `json:"amount"`
	LocationId  int    `json:"locationId"`
	TreatmentId int    `json:"treatmentId"`
}
