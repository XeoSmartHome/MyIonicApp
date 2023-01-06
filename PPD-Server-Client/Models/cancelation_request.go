package Models

type CancelationRequest struct {
	ClientCNP string `json:"clientCNP"`
	Amount    int    `json:"amount"`
}
