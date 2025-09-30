//
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LeerJson, GetMetrics } from "../../wailsjs/go/main/App"


function Carga(){
    const navigate = useNavigate()

    const [politica, setPolitica] = useState("fcfs")
    const [fileName, setFileName ] = useState("")
    const [jsonStr, setJsonStr] = useState("")
    const [procesos, setProcesos] = useState([])
    //datos de entrada
    const [TIP, setTIP] = useState("");
    const [TFP, setTFP] = useState("");
    const [TCP, setTCP] = useState("");
    const [quantum, setQuantum] = useState("");

    const [isLoading, setIsLoading] = useState(false)

    const handleFilechance = async (e) => {
        const file = e.target.files[0]
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        } else {
            setFileName("Ningun archivo seleccionado")
            return
        }
        const text = await file.text()
        try {
            const result = await LeerJson(text)
            setProcesos(result)
        } catch (err) {
            console.error("Error al leer JSON: ", err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const carga = {
                Politica: politica,
                TIP: Number(TIP),
                TFP: Number(TFP),
                TCP: Number(TCP),
                Quantum: Number(quantum),
            }
        try {
            const metrics = await GetMetrics(procesos, carga)
            navigate("/Resultado", { state: { metrics, procesos } })
        } catch (err) {
            console.error(err)
            alert("Error al calcular métricas")
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <div className="flex flex-col items-center px-3">
            <h3 className="text-2xl my-2">Carga de Json</h3>
            <div className="space-x-4 mb-2">
                <label className="boton">
                    seleccionar archivo
                    <input 
                        type="file"
                        className="hidden"
                        onChange={handleFilechance}
                    />
                </label>
                <span className="text-gray-600 italic">{fileName}</span>
            </div>
            <table className="tabla">
                <thead>
                    <tr>
                    <th >Proceso</th>
                    <th >T. Arribo</th>
                    <th >Ráfaga CPU</th>
                    <th >Duración Ráfaga CPU</th>
                    <th >Ráfaga E/S CPU</th>
                    <th >Prioridad</th>
                    </tr>
                </thead>
                <tbody>
                    {procesos.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-gray-500">No hay procesos</td>
                        </tr>
                    ) : (
                        procesos.map((p, i) => (
                            <tr key={i}>
                                <td>{p.nombre}</td>
                                <td>{p.tiempo_arribo}</td>
                                <td>{p.cantidad_rafagas_cpu}</td>
                                <td>{p.duracion_rafaga_cpu}</td>
                                <td>{p.duracion_rafaga_es}</td>
                                <td>{p.prioridad_externa}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <form onSubmit={handleSubmit} className="my-1">
                <div>
                    <label htmlFor="politica" className="mr-2">Elija una politica</label>
                    <select
                        id="politica"
                        value={politica}
                        onChange={(e) => setPolitica(e.target.value)}
                        className="boton"
                    >
                        <option value="fcfs">FCFS</option>
                        <option value="prioridad">Prioridad Externa</option>
                        <option value="rr">Round-Robin</option>
                        <option value="spn">SPN</option>
                        <option value="srtn">SRTN</option>
                    </select>
                </div>
                <div>
                    <input 
                        type="number" 
                        min="0" 
                        className="border px-3 py-2 mb-1 rounded-lg w-100" 
                        placeholder="TIP" 
                        value={TIP}
                        onChange={(e) => setTIP(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="number" 
                        min="1" 
                        className="border px-3 py-2 mb-1 rounded-lg w-100" 
                        placeholder="TFP"
                        value={TFP}
                        onChange={(e) => setTFP(e.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="number" 
                        min="1" 
                        className="border px-3 py-2 mb-1 rounded-lg w-100" 
                        placeholder="TCP" 
                        value={TCP}
                        onChange={(e) => setTCP(e.target.value)}
                    />
                </div>
                {politica === "rr" && (
                    <div>
                        <input 
                            type="number" 
                            min="1" 
                            className="border px-3 py-2 mb-1 rounded-lg w-100" 
                            placeholder="Quantum" 
                            value={quantum}
                            onChange={(e) => setQuantum(e.target.value)}
                        />
                    </div>
                )}
                <button className="boton" type="submit">Cargar</button>
            </form>
        </div>
    )
}
export default Carga