import React from "react"

function Gantt({ procesos, escala = 50 }){
    return(
        <div className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-xl font-bold mb-4">Diagrama de Gantt</h3>

      <div className="space-y-2">
        {procesos.map((p, idx) => (
          <div key={idx} className="flex items-center">
            {/* Nombre del proceso */}
            <span className="w-16 font-semibold">{p.nombre}</span>

            {/* Barras de Gantt */}
            <div className="flex">
              {p.rafagas.map((duracion, i) => (
                <div
                  key={i}
                  className="h-8 bg-blue-400 border border-black flex items-center justify-center text-xs"
                  style={{ width: `${duracion * escala}px` }}
                >
                  {duracion}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}
export default Gantt