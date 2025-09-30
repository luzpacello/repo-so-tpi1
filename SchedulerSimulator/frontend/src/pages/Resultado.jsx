import { useLocation, Link } from "react-router-dom"
import Gantt from "../components/Gannt"

function Resultado(){
    const { state } = useLocation()
    const { metrics, procesos } = state || {}

    const descargarResultados = () => {
        if (!metrics || !procesos) return;

        let contenido = "Resultados de la simulación\n\n";

        contenido += "=== Procesos ===\n";
        metrics.Processes.forEach(p => {
            contenido += `Proceso: ${p.Name}\n`;
            contenido += `Turnaround Time: ${p.TurnaroundTime}\n`;
            contenido += `Turnaround Normalizado: ${p.NormalizedTurnaround.toFixed(2)}\n`;
            contenido += `Tiempo en Listo: ${p.ReadyTime}\n`;
            contenido += `Intervalos:\n`;
            p.Intervals.forEach(intv => {
            contenido += `  [${intv.Start} - ${intv.End}]\n`;
            });
            contenido += "\n";
        });

        contenido += "=== Resumen ===\n";
        contenido += `Total Turnaround: ${metrics.Summary.TotalTurnaround}\n`;
        contenido += `Avg Turnaround: ${metrics.Summary.AvgTurnaroundTime.toFixed(2)}\n`;
        contenido += `CPU Idle: ${metrics.Summary.CPUIdle}\n`;
        contenido += `CPU Sistema: ${metrics.Summary.CPUSystem}\n`;
        contenido += `CPU Usuario: ${metrics.Summary.CPUUser}\n`;

        // Crear blob y descargar
        const blob = new Blob([contenido], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resultados.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return(
        <div className="flex flex-col px-5 items-start w-full overflow-auto">
            <h3 className="text-2xl self-center">Metricas</h3>
            
            <div className="w-full">
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
                    {metrics.Processes.map((p, i) => (
                        <tr key={i}>
                            <td>{p.Name}</td>
                            <td>{p.TurnaroundTime}</td>
                            <td>{p.NormalizedTurnaround.toFixed(2)}</td>
                            <td>{p.ReadyTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="tabla">
                <caption className="caption-top">
                    Tabla de tiempos por tanda
                </caption>
                <thead>
                    <tr>
                        <th>Tiempo de Retorno</th>
                        <th>Tiempo Medio de Retorno</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{metrics.Summary.TotalTurnaround}</td>
                        <td>{metrics.Summary.AvgTurnaroundTime.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className="w-full">
                <table className="tabla">
                <caption className="caption-top">
                    Tabla uso de CPU
                </caption>
                <thead>
                    <tr>
                        <th>Tiempo de desocupado</th>
                        <th>usado por CPU</th>
                        <th>usado por Procesos (tiempo abs)</th>
                        <th>usado por Procesos (tiempo %)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{metrics.Summary.CPUIdle}</td>
                        <td>{metrics.Summary.CPUSystem}</td>
                        <td>{metrics.Summary.CPUUser}</td>
                        <td>
                            {metrics.Summary.CPUUser + metrics.Summary.CPUSystem > 0
                            ? (
                                (metrics.Summary.CPUUser * 100) /
                                (metrics.Summary.CPUUser + metrics.Summary.CPUSystem)
                                ).toFixed(2) + "%"
                            : "0%"}
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className="flex justify-around w-full mt-1">
                <button className="boton" onClick={descargarResultados}>descargar resultados</button>
                <Link to="/" className="boton"> Probar otra tanda</Link>
            </div>
        </div>
    )
}
export default Resultado