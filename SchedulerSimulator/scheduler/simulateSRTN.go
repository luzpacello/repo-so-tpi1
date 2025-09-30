package scheduler

import (
	"sort"
)

func SimulateSRTN(input InputData) OutputData {
	var results []ResultProcess
	var currentTime int
	var cpuIdle, cpuUser, cpuSystem, totalTurnaround int

	processes := input.Processes
	params := input.Params

	type procState struct {
		P             Process
		RemainingBurst int
		Intervals      []Interval
		Finished       bool
		ReadyTime      int
		LastReadyStart int
		ArrivalTime    int
	}

	states := make([]*procState, len(processes))
	for i, p := range processes {
		states[i] = &procState{
			P:             p,
			RemainingBurst: p.CantidadRafagasCPU * p.DuracionRafagaCPU,
			Intervals:     []Interval{},
			Finished:      false,
			ReadyTime:     0,
			LastReadyStart: -1,
			ArrivalTime:    p.TiempoArribo,
		}
	}

	pending := append([]*procState{}, states...) // procesos por llegar
	readyQueue := []*procState{}
	var running *procState = nil

	for len(pending) > 0 || len(readyQueue) > 0 || running != nil {
		// 1. Mover procesos que cumplen TIP a la cola de listos
		for i := 0; i < len(pending); i++ {
			p := pending[i]
			if currentTime >= p.ArrivalTime+params.TIP {
				p.LastReadyStart = currentTime
				readyQueue = append(readyQueue, p)
				pending = append(pending[:i], pending[i+1:]...)
				i--
			}
		}

		// 2. Ordenar lista por RemainingBurst (menor primero)
		sort.SliceStable(readyQueue, func(i, j int) bool {
			return readyQueue[i].RemainingBurst < readyQueue[j].RemainingBurst
		})

		// 3. Despachar si no hay proceso corriendo o preemptar
		if running == nil && len(readyQueue) > 0 {
			running = readyQueue[0]
			readyQueue = readyQueue[1:]
			currentTime += params.TCP
			cpuSystem += params.TCP
			if running.LastReadyStart >= 0 {
				running.ReadyTime += currentTime - running.LastReadyStart
				running.LastReadyStart = -1
			}
		} else if running != nil && len(readyQueue) > 0 && readyQueue[0].RemainingBurst < running.RemainingBurst {
			// preempción
			running.LastReadyStart = currentTime
			readyQueue = append(readyQueue, running)
			running = readyQueue[0]
			readyQueue = readyQueue[1:]
			currentTime += params.TCP
			cpuSystem += params.TCP
			if running.LastReadyStart >= 0 {
				running.ReadyTime += currentTime - running.LastReadyStart
				running.LastReadyStart = -1
			}
		}

		// 4. Si no hay nada corriendo, avanzar tiempo
		if running == nil {
			if len(pending) > 0 {
				nextArrival := pending[0].ArrivalTime + params.TIP
				for _, p := range pending {
					if p.ArrivalTime+params.TIP < nextArrival {
						nextArrival = p.ArrivalTime + params.TIP
					}
				}
				cpuIdle += nextArrival - currentTime
				currentTime = nextArrival
				continue
			} else {
				break
			}
		}

		// 5. Ejecutar 1 unidad de tiempo
		start := currentTime
		currentTime++
		running.RemainingBurst--
		end := currentTime
		cpuUser++
		running.Intervals = append(running.Intervals, Interval{Start: start, End: end})

		// 6. Chequear si el proceso terminó
		if running.RemainingBurst == 0 {
			// TFP
			currentTime += params.TFP
			cpuSystem += params.TFP
			running.Finished = true
			running = nil
		}
	}

	// 7. Calcular métricas finales
	for _, p := range states {
		turnaround := 0
		if len(p.Intervals) > 0 {
			lastEnd := p.Intervals[len(p.Intervals)-1].End
			turnaround = lastEnd + params.TFP - p.ArrivalTime
		}
		totalCPU := p.P.CantidadRafagasCPU * p.P.DuracionRafagaCPU
		normalized := float64(turnaround) / float64(totalCPU)
		results = append(results, ResultProcess{
			Name:                 p.P.Nombre,
			TurnaroundTime:       turnaround,
			NormalizedTurnaround: normalized,
			ReadyTime:            p.ReadyTime,
			Intervals:            p.Intervals,
		})
		totalTurnaround += turnaround
	}

	summary := ResultSummary{
		AvgTurnaroundTime: float64(totalTurnaround) / float64(len(processes)),
		TotalTurnaround:   totalTurnaround,
		CPUIdle:           cpuIdle,
		CPUSystem:         cpuSystem,
		CPUUser:           cpuUser,
	}

	return OutputData{
		Processes: results,
		Summary:   summary,
	}
}
