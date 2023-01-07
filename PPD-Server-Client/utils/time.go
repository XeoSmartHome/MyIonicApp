package utils

import "fmt"

const startHour = 10

func FormatTime(time int) string {
	hour := time/60 + startHour
	minute := time % 60

	return fmt.Sprintf("%02d:%02d", hour, minute)
}
