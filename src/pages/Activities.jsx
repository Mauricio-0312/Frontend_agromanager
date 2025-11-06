import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Activities(){
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{ load() }, [])

    async function load(){
        setLoading(true)
        try{
            const res = await api.fetchActividades()
            setItems(res.data)
        }catch(err){ console.error(err) }
        setLoading(false)
    }

    async function remove(id){ if(!confirm('Eliminar actividad?')) return; try{ await api.deleteActividad(id); load() }catch(err){ alert('Error') } }

    if(loading) return <div className="p-6">Cargando...</div>

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-3">Actividades Agrícolas</h3>
            {items.length === 0 ? (
                <div className="text-sm text-gray-500">No hay actividades registradas</div>
            ) : (
                <div className="space-y-3">
                    {items.map(a => (
                        <div key={a.id || a.ID} className="bg-white border rounded p-3 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-800">{a.actividad || a.Actividad}</div>
                                    <div className="text-xs text-gray-500">{a.fecha ? new Date(a.fecha).toLocaleDateString() : (a.Fecha ? new Date(a.Fecha).toLocaleDateString() : '-')}</div>
                                </div>
                                <div className="text-sm text-gray-600">Proyecto: {a.project_id || a.ProjectID || '-'}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">Labor: {a.labor_agronomica ? a.labor_agronomica.descripcion : (a.LaborAgronomica ? a.LaborAgronomica.Descripcion : '-')}</div>
                            <div className="mt-2 text-sm text-gray-700">Equipos: {(a.equipos || a.Equipos || []).map(e=>e.descripcion || e.Descripcion).join(', ') || '-'}</div>
                            <div className="mt-2 flex gap-2"><button onClick={()=>remove(a.id || a.ID)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
