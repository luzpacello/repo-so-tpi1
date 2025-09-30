package main

import (
	"SchedulerSimulator/scheduler"
	"context"
	"encoding/json"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// funciones para el front
func (a *App) LeerJson(jsonStr string) ([]scheduler.Process, error) {
	var procesos []scheduler.Process
	err := json.Unmarshal([]byte(jsonStr), &procesos)
	if err != nil {
		return nil, err
	}
	return procesos, nil
}

func (a *App) GetMetrics(processes []scheduler.Process, params scheduler.Params) (scheduler.OutputData, error) {
	if params.Politica == "" {
		return scheduler.OutputData{}, fmt.Errorf("no se recibió configuración")
	}

	input := scheduler.InputData{
		Processes: processes,
		Params:    params,
	}
	tipo := params.Politica
	switch tipo {
	case "fcfs":
		return scheduler.SimulateFCFS(input), nil
	case "rr":
		return scheduler.SimulateRR(input), nil
	case "prioridad":
		return scheduler.SimulatePriority(input), nil
	case "spn":
		return scheduler.SimulateSPN(input), nil
	case "srtn":
		return scheduler.SimulateSRTN(input), nil
	}
	return scheduler.OutputData{}, fmt.Errorf("no se encontró la politica elegida")
}
