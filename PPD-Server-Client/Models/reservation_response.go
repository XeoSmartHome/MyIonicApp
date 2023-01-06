package Models

type ReservationResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Cost    int    `json:"cost"`
}
