import React from 'react'


export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card col-span-2">
                <h3 className="text-lg font-semibold">Resumen de Proyectos</h3>
                <p className="text-sm text-gray-600 mt-2">Aquí verás informacion importante referente a los proyectos.</p>
            </div>
            <div className="card">
                <h3 className="text-lg font-semibold">KPIs</h3>
                <div className="mt-3 grid gap-3">
                    <div className="p-3 bg-green-50 rounded">Proyectos activos: <strong>...</strong></div>
                    <div className="p-3 bg-yellow-50 rounded">Producción esperada: <strong>...</strong></div>
                    <div className="p-3 bg-blue-50 rounded">Usuarios: <strong>...</strong></div>
                </div>
            </div>
        </div>
    )
}