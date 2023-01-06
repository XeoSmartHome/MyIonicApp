package Models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Reservation struct {
	Id             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Client         string             `bson:"client" json:"client"`
	CNP            string             `bson:"cnp" json:"cnp"`
	CreatedAt      primitive.DateTime `bson:"CreatedAt" json:"createdAt"`
	TreatmentStart int                `bson:"treatmentStart" json:"treatmentStart"`
	TreatmentEnd   int                `bson:"treatmentEnd" json:"treatmentEnd"`
	TreatmentId    int                `bson:"treatmentId" json:"treatmentId"`
	LocationId     int                `bson:"locationId" json:"locationId"`
}
