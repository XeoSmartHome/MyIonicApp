package Models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Payment struct {
	Id          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Date        primitive.DateTime `bson:"date" json:"date"`
	CNP         string             `bson:"cnp" json:"cnp"`
	Amount      int                `bson:"amount" json:"amount"`
	LocationId  int                `bson:"locationId" json:"locationId"`
	TreatmentId int                `bson:"treatmentId" json:"treatmentId"`
}
