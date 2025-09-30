package scheduler

import "sort"

func SimulateFCFS(input InputData) OutputData {
	var results []ResultProcess
	var currentTime int
	var totalTurnaround int
	var cpuIdle int
	var cpuUser int
	var cpuSystem int

	processes := input.Processes
	params := input.Params

	sort.Slice(processes, func(i, j int) bool {
		return processes[i].TiempoArribo < processes[j].TiempoArribo
	})

	for _, p := range processes {
		if currentTime < p.TiempoArribo {
			cpuIdle += p.TiempoArribo - currentTime
			currentTime = p.TiempoArribo
		}

		start := currentTime + params.TIP

		duration := p.CantidadRafagasCPU * p.DuracionRafagaCPU
		finish := start + duration

		finish += params.TFP

		turnaround := finish - p.TiempoArribo
		normalized := float64(turnaround) / float64(duration)
		readyTime := start - p.TiempoArribo

		results = append(results, ResultProcess{
			Name:                 p.Nombre,
			TurnaroundTime:       turnaround,
			NormalizedTurnaround: normalized,
			ReadyTime:            readyTime,
			Intervals: []Interval{
				{Start: start, End: finish},
			},
		})

		totalTurnaround += turnaround
		cpuUser += duration
		cpuSystem += params.TIP + params.TFP + params.TCP

		currentTime = finish + params.TCP
	}

	summary := ResultSummary{
		AvgTurnaroundTime: float64(totalTurnaround) / float64(len(processes)),
		TotalTurnaround:   totalTurnaround,
		CPUIdle:           cpuIdle,
		CPUSystem:         cpuSystem,
		CPUUser:           cpuSystem,
	}

	return OutputData{Processes: results, Summary: summary}
}
