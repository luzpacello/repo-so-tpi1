package scheduler

// 🌱 Estructuras 🌱

type Process struct {
	Nombre             string `json:"nombre"`
	TiempoArribo       int    `json:"tiempo_arribo"`
	CantidadRafagasCPU int    `json:"cantidad_rafagas_cpu"`
	DuracionRafagaCPU  int    `json:"duracion_rafaga_cpu"`
	DuracionRafagaES   int    `json:"duracion_rafaga_es"`
	PrioridadExterna   int    `json:"prioridad_externa"`
}

type Params struct {
	Politica string
	TIP      int
	TFP      int
	TCP      int
	Quantum  int
}

type InputData struct {
	Processes []Process
	Params    Params
}

type Interval struct {
	Start int
	End   int
}

// 🌱 metrics return 🌱
type ResultProcess struct {
	Name                 string
	TurnaroundTime       int
	NormalizedTurnaround float64
	ReadyTime            int
	Intervals            []Interval
}

type ResultSummary struct {
	AvgTurnaroundTime float64
	TotalTurnaround   int
	CPUIdle           int
	CPUSystem         int
	CPUUser           int
}

type OutputData struct {
	Processes []ResultProcess
	Summary   ResultSummary
}
