//
import { useState } from "react"
import { Link } from "react-router"

function Carga(){
    const [politica, setPolitica] = useState("fcfs")
    const [fileName, setFileName ] = useState("Ningun archivo seleccionado")

    const handleFilechance = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        } else {
            setFileName("Ningun archivo seleccionado")
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
                    <th >Ráfaga E/S CPU</th>
                    <th >Prioridad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    </tr>
                    <tr>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    <td >nose</td>
                    </tr>
                </tbody>
            </table>
            <form action="" className="my-1">
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
                <div><input type="number" min="0" className="border px-3 py-2 mb-1 rounded-lg w-100" placeholder="TIP" /></div>
                <div><input type="number" min="0" className="border px-3 py-2 mb-1 rounded-lg w-100" placeholder="TFP" /></div>
                <div><input type="number" min="0" className="border px-3 py-2 mb-1 rounded-lg w-100" placeholder="TCP" /></div>
                {politica === "rr" && (
                    <div>
                        <input type="number" min="0" className="border px-3 py-2 mb-1 rounded-lg w-100" placeholder="Quantum" />
                    </div>
                )}
                    <button className="boton" type="submit">Cargar</button>
            </form>
            <Link to="/Resultado" className="boton">Siguiente</Link>
        </div>
    )
}
export default Carga