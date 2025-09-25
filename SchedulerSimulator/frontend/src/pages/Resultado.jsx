import { Link } from "react-router"
import Gantt from "../components/Gannt"

function Resultado(){
    const procesos = [
        { nombre: "P1", rafagas: [3, 2]},
        { nombre: "P2", rafagas: [4]},
        { nombre: "P3", rafagas: [2, 1, 3]},
    ]
    return(
        <div className="flex flex-col px-3 items-start w-full">
            <h3 className="text-2xl self-center">Metricas</h3>
            <div className="flex self-center">
                <Gantt procesos={procesos} />
            </div>
            <table className="tabla">
                <caption className="caption-top">
                    Tabla de tiempos por proceso
                </caption>
                <thead>
                    <tr>
                        <th>Proceso</th>
                        <th>Retorno</th>
                        <th>Retorno Normalizado</th>
                        <th>Estado Listo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>hola</td>
                        <td>hola</td>
                        <td>hola</td>
                        <td>hola</td>
                    </tr>
                </tbody>
            </table>
            <table className="tabla">
                <caption className="caption-top">
                    Tabla de tiempos por tanda
                </caption>
                <tr>
                    <th>Tiempo de Retorno</th>
                    <td>Resultado</td>
                </tr>
                <tr>
                    <th>Tiempo Medio de Retorno</th>
                    <td>Resultado</td>
                </tr>
            </table>
            <table className="tabla">
                <caption className="caption-top">
                    Tabla uso de CPU
                </caption>
                <tr>
                    <th>Tiempo de desocupado</th>
                    <td>Resultado</td>
                </tr>
                <tr>
                    <th>usado por CPU</th>
                    <td>Resultado</td>
                </tr>
                <tr>
                    <th>usado por Procesos (tiempo abs)</th>
                    <td>Resultado</td>
                </tr>
                <tr>
                    <th>usado por Procesos (tiempo %)</th>
                    <td>Resultado</td>
                </tr>
            </table>
            <div className="flex justify-around w-full mt-1">
                <Link to="/" className="boton">Volver</Link>
                <button className="boton">descargar resultados</button>
                <button className="boton">probar otra tanda</button>
            </div>
        </div>
    )
}
export default Resultado