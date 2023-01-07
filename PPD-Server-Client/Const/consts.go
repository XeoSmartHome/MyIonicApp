package Const

import "PPD-Server-Client/Models"

var Locations = []Models.Location{
	{
		Id:   1,
		Name: "Location 1",
		Treatments: []Models.Treatment{
			{
				Id:       11,
				Price:    50,
				Duration: 120,
				Capacity: 3,
			},
			{
				Id:       12,
				Price:    20,
				Duration: 20,
				Capacity: 1,
			},
			{
				Id:       13,
				Price:    40,
				Duration: 30,
				Capacity: 1,
			},
			{
				Id:       14,
				Price:    100,
				Duration: 60,
				Capacity: 2,
			},
			{
				Id:       15,
				Price:    30,
				Duration: 30,
				Capacity: 1,
			},
		},
	},
	{
		Id:   2,
		Name: "Location 2",
		Treatments: []Models.Treatment{
			{
				Id:       11,
				Price:    50,
				Duration: 120,
				Capacity: 3,
			},
			{
				Id:       12,
				Price:    20,
				Duration: 20,
				Capacity: 1,
			},
			{
				Id:       13,
				Price:    40,
				Duration: 30,
				Capacity: 1,
			},
			{
				Id:       14,
				Price:    100,
				Duration: 60,
				Capacity: 2,
			},
			{
				Id:       15,
				Price:    30,
				Duration: 30,
				Capacity: 1,
			},
		},
	},
	{
		Id:   3,
		Name: "Location 3",
		Treatments: []Models.Treatment{
			{
				Id:       11,
				Price:    50,
				Duration: 120,
				Capacity: 6,
			},
			{
				Id:       12,
				Price:    20,
				Duration: 20,
				Capacity: 2,
			},
			{
				Id:       13,
				Price:    40,
				Duration: 30,
				Capacity: 2,
			},
			{
				Id:       14,
				Price:    100,
				Duration: 60,
				Capacity: 4,
			},
			{
				Id:       15,
				Price:    30,
				Duration: 30,
				Capacity: 2,
			},
		},
	},
}
