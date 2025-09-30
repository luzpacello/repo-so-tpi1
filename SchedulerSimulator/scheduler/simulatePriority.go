package scheduler

import (
	"sort"
)

func SimulatePriority(input InputData) OutputData {
	var results []ResultProcess
	var currentTime int
	var cpuIdle, cpuUser, cpuSystem, totalTurnaround int

	processes := input.Processes
	params := input.Params

	type procState struct {
		P              Process
		RemainingBurst int // ráfagas CPU restantes
		NextBurst      int // duración de la ráfaga actual restante
		Intervals      []Interval
		Finished       bool
		ReadyTime      int
		LastReadyStart int
		ArrivalTime    int
	}

	states := make([]*procState, len(processes))
	for i, p := range processes {
		states[i] = &procState{
			P:              p,
			RemainingBurst: p.CantidadRafagasCPU,
			NextBurst:      p.DuracionRafagaCPU,
			Intervals:      []Interval{},
			Finished:       false,
			ReadyTime:      0,
			LastReadyStart: -1,
			ArrivalTime:    p.TiempoArribo,
		}
	}

	pending := append([]*procState{}, states...)
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

		// 2. Ordenar la cola por prioridad (MAYOR número = mayor prioridad)
		sort.SliceStable(readyQueue, func(i, j int) bool {
			return readyQueue[i].P.PrioridadExterna > readyQueue[j].P.PrioridadExterna
		})

		// 3. Si no hay proceso corriendo, despachar primero de la cola
		if running == nil && len(readyQueue) > 0 {
			running = readyQueue[0]
			readyQueue = readyQueue[1:]
			// TCP al despachar
			currentTime += params.TCP
			cpuSystem += params.TCP
			if running.LastReadyStart >= 0 {
				running.ReadyTime += currentTime - running.LastReadyStart
				running.LastReadyStart = -1
			}
		}

		// 4. Si aún no hay nada corriendo, avanzar tiempo
		if running == nil {
			if len(pending) > 0 {
				// avanzar al siguiente TIP
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

		// 5. Determinar duración de ejecución hasta:
		// - terminar ráfaga actual
		// - preempción por proceso de mayor prioridad que llegue
		runTime := running.NextBurst
		if len(pending) > 0 {
			for _, p := range pending {
				arrivalWithTIP := p.ArrivalTime + params.TIP
				if arrivalWithTIP > currentTime &&
					arrivalWithTIP < currentTime+runTime &&
					p.P.PrioridadExterna > running.P.PrioridadExterna { // 🔹 acá el cambio
					runTime = arrivalWithTIP - currentTime
					break
				}
			}
		}

		// 6. Ejecutar
		start := currentTime
		end := start + runTime
		running.Intervals = append(running.Intervals, Interval{Start: start, End: end})
		currentTime = end
		cpuUser += runTime
		running.NextBurst -= runTime

		// 7. Chequear si la ráfaga terminó
		if running.NextBurst == 0 {
			running.RemainingBurst--
			if running.RemainingBurst > 0 {
				// Bloqueado por E/S
				currentTime += running.P.DuracionRafagaES
				running.NextBurst = running.P.DuracionRafagaCPU
				// Vuelve a listo
				running.LastReadyStart = currentTime
				readyQueue = append(readyQueue, running)
			} else {
				// Termina proceso → TFP
				currentTime += params.TFP
				cpuSystem += params.TFP
				running.Finished = true
				running = nil
			}
		} else {
			// Preempción → volver a lista
			running.LastReadyStart = currentTime
			readyQueue = append(readyQueue, running)
			running = nil
		}
	}

	// Calcular métricas finales
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
