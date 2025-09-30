export namespace scheduler {
	
	export class Interval {
	    Start: number;
	    End: number;
	
	    static createFrom(source: any = {}) {
	        return new Interval(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Start = source["Start"];
	        this.End = source["End"];
	    }
	}
	export class ResultSummary {
	    AvgTurnaroundTime: number;
	    TotalTurnaround: number;
	    CPUIdle: number;
	    CPUSystem: number;
	    CPUUser: number;
	
	    static createFrom(source: any = {}) {
	        return new ResultSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.AvgTurnaroundTime = source["AvgTurnaroundTime"];
	        this.TotalTurnaround = source["TotalTurnaround"];
	        this.CPUIdle = source["CPUIdle"];
	        this.CPUSystem = source["CPUSystem"];
	        this.CPUUser = source["CPUUser"];
	    }
	}
	export class ResultProcess {
	    Name: string;
	    TurnaroundTime: number;
	    NormalizedTurnaround: number;
	    ReadyTime: number;
	    Intervals: Interval[];
	
	    static createFrom(source: any = {}) {
	        return new ResultProcess(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Name = source["Name"];
	        this.TurnaroundTime = source["TurnaroundTime"];
	        this.NormalizedTurnaround = source["NormalizedTurnaround"];
	        this.ReadyTime = source["ReadyTime"];
	        this.Intervals = this.convertValues(source["Intervals"], Interval);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class OutputData {
	    Processes: ResultProcess[];
	    Summary: ResultSummary;
	
	    static createFrom(source: any = {}) {
	        return new OutputData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Processes = this.convertValues(source["Processes"], ResultProcess);
	        this.Summary = this.convertValues(source["Summary"], ResultSummary);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Params {
	    Politica: string;
	    TIP: number;
	    TFP: number;
	    TCP: number;
	    Quantum: number;
	
	    static createFrom(source: any = {}) {
	        return new Params(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Politica = source["Politica"];
	        this.TIP = source["TIP"];
	        this.TFP = source["TFP"];
	        this.TCP = source["TCP"];
	        this.Quantum = source["Quantum"];
	    }
	}
	export class Process {
	    nombre: string;
	    tiempo_arribo: number;
	    cantidad_rafagas_cpu: number;
	    duracion_rafaga_cpu: number;
	    duracion_rafaga_es: number;
	    prioridad_externa: number;
	
	    static createFrom(source: any = {}) {
	        return new Process(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nombre = source["nombre"];
	        this.tiempo_arribo = source["tiempo_arribo"];
	        this.cantidad_rafagas_cpu = source["cantidad_rafagas_cpu"];
	        this.duracion_rafaga_cpu = source["duracion_rafaga_cpu"];
	        this.duracion_rafaga_es = source["duracion_rafaga_es"];
	        this.prioridad_externa = source["prioridad_externa"];
	    }
	}
	

}

