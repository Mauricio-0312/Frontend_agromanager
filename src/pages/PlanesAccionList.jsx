import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function PlanesAccionList(){
    const { id } = useParams()
    const [planes, setPlanes] = useState([])

    useEffect(()=>{ load() }, [])

    async function load(){
        try{ const res = await api.getPlanesAccion(id); setPlanes(res.data) }catch(err){ console.error(err) }
    }

    async function remove(pid){ if(!confirm('Eliminar plan?')) return; try{ await api.deletePlanAccion(pid); load() }catch(err){ alert('Error') } }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Planes de Acción</h3>
                <Link to={`/projects/${id}/planes-accion/crear`} className="btn bg-primary text-white px-3">Agregar</Link>
            </div>
            <div className="mt-4">
                <table className="w-full">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Actividad</th><th className="px-4 py-2">Acción</th><th className="px-4 py-2">Responsable</th><th className="px-4 py-2">Horas</th><th className="px-4 py-2">Monto</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {planes.map(p=> (
                            <tr key={p.id}>
                                <td className="px-4 py-2">{p.id}</td>
                                <td className="px-4 py-2">{p.actividad}</td>
                                <td className="px-4 py-2">{p.accion}</td>
                                <td className="px-4 py-2">{p.responsable ? p.responsable.email : '-'}</td>
                                <td className="px-4 py-2">{p.cantidad_horas}</td>
                                <td className="px-4 py-2">{p.monto}</td>
                                <td className="px-4 py-2">
                                    <Link to={`/planes-accion/${p.id}/editar`} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Editar</Link>
                                    <Link to={`/planes-accion/${p.id}/costos-humanos`} className="mr-2 btn bg-gray-100 px-2 py-1 rounded">Costos Humanos</Link>
                                    <Link to={`/planes-accion/${p.id}/costos-materiales`} className="mr-2 btn bg-gray-100 px-2 py-1 rounded">Costos Materiales</Link>
                                    <button onClick={()=>remove(p.id)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
