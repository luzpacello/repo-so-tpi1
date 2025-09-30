import React from "react"

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-red-500",
]

function Gantt({ procesos = [], escala = 50, loading = false }) {
  // Overlay de carga
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white z-50">
        Cargando...
      </div>
    )
  }

  // Si no hay procesos
  if (!procesos || procesos.length === 0) {
    return <p className="text-gray-500">No hay procesos para mostrar</p>
  }

  // Calcular tiempo total
  const tiempoTotal = Math.max(
    0,
    ...procesos.flatMap((p) =>
      p.Intervals ? p.Intervals.map((int) => int.End) : [0]
    )
  )

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Diagrama de Gantt</h3>
      <div className="">
      </div>
    </div>
  )
}

export default Gantt
