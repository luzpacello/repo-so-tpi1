package scheduler

func SimulateRR(input InputData) OutputData {
	var results []ResultProcess
	var currentTime int
	var totalTurnaround int
	var cpuIdle int
	var cpuUser int
	var cpuSystem int

	processes := input.Processes
	params := input.Params

	type procState struct {
		P            Process
		RemainingCPU int
		NextBurst    int
		Intervals    []Interval
		Finished     bool
		ArrivalTime  int
		ReadyTime    int // tiempo total en listo
		LastQueueIn  int // momento en que entró a la cola
	}

	// Inicializar estados
	states := make([]*procState, len(processes))
	for i, p := range processes {
		states[i] = &procState{
			P:            p,
			RemainingCPU: p.CantidadRafagasCPU,
			NextBurst:    p.DuracionRafagaCPU,
			Intervals:    []Interval{},
			Finished:     false,
			ArrivalTime:  p.TiempoArribo,
			ReadyTime:    0,
			LastQueueIn:  p.TiempoArribo + params.TIP,
		}
	}

	queue := []*procState{}
	pending := append([]*procState{}, states...)

	for len(queue) > 0 || len(pending) > 0 {
		// Mover procesos que llegaron + TIP a la cola
		for i := 0; i < len(pending); i++ {
			p := pending[i]
			if currentTime >= p.ArrivalTime+params.TIP {
				p.LastQueueIn = currentTime
				queue = append(queue, p)
				pending = append(pending[:i], pending[i+1:]...)
				i--
			}
		}

		// Si no hay procesos listos
		if len(queue) == 0 {
			if len(pending) == 0 {
				break
			}
			nextArrival := pending[0].ArrivalTime + params.TIP
			for _, p := range pending {
				if p.ArrivalTime+params.TIP < nextArrival {
					nextArrival = p.ArrivalTime + params.TIP
				}
			}
			cpuIdle += nextArrival - currentTime
			currentTime = nextArrival
			continue
		}

		// Tomar primer proceso de la cola
		proc := queue[0]
		queue = queue[1:]

		// TCP al despachar
		currentTime += params.TCP
		cpuSystem += params.TCP

		// sumar tiempo en listo
		proc.ReadyTime += currentTime - proc.LastQueueIn

		// Duración de ejecución (Quantum o ráfaga restante)
		duration := params.Quantum
		if duration > proc.NextBurst {
			duration = proc.NextBurst
		}

		start := currentTime
		end := start + duration
		proc.Intervals = append(proc.Intervals, Interval{Start: start, End: end})

		currentTime = end
		cpuUser += duration
		proc.NextBurst -= duration

		if proc.NextBurst == 0 {
			proc.RemainingCPU--
			if proc.RemainingCPU > 0 {
				// Bloqueado por E/S
				currentTime += proc.P.DuracionRafagaES
				proc.NextBurst = proc.P.DuracionRafagaCPU
				proc.LastQueueIn = currentTime // vuelve a listo
				queue = append(queue, proc)
			} else {
				// Proceso termina → sumar TFP
				currentTime += params.TFP
				cpuSystem += params.TFP
				proc.Finished = true
			}
		} else {
			// Quantum terminado, queda ráfaga → vuelve a listo
			proc.LastQueueIn = currentTime
			queue = append(queue, proc)
		}
	}

	// Calcular métricas finales
	for _, p := range states {
		turnaround := 0
		if len(p.Intervals) > 0 {
			turnaround = p.Intervals[len(p.Intervals)-1].End + params.TFP - p.ArrivalTime
		}
		normalized := float64(turnaround) / float64(p.P.CantidadRafagasCPU*p.P.DuracionRafagaCPU)
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
