package Models

type GenericRequest struct {
	Event string      `json:"event"`
	Data  interface{} `json:"data"`
}
