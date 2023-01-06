package Models

type PaymentRequest struct {
	ClientCNP string `json:"clientCNP"`
	Amount    int    `json:"amount"`
}
