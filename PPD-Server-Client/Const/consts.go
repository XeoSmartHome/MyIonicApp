package Const

import "PPD-Server-Client/Models"

var Locations = []Models.Location{
	{
		Id:   1,
		Name: "Location 1",
		Treatments: []Models.Treatment{
			{
				Id:       11,
				Price:    1,
				Duration: 100,
				Capacity: 2,
			},
			{
				Id:       12,
				Price:    1,
				Duration: 100,
				Capacity: 2,
			},
		},
	},
	{
		Id:   2,
		Name: "Location 2",
		Treatments: []Models.Treatment{
			{
				Id:       21,
				Price:    1,
				Duration: 100,
				Capacity: 2,
			},
			{
				Id:       22,
				Price:    1,
				Duration: 100,
				Capacity: 5,
			},
		},
	},
}
