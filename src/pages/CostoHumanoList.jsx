import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function CostoHumanoList(){
    const { id } = useParams() // project plan id or project id depending on route
    const [costos, setCostos] = useState([])

    useEffect(()=>{ load() }, [])

    async function load(){
        try{
            // if this route is /projects/:id/planes-accion/costos-humano then id is project id and we need to fetch plans first? 
            // We'll assume route /planes-accion/:id/costos-humanos where id is plan id
            const res = await api.getCostosHumanos(id)
            setCostos(res.data)
        }catch(err){ console.error(err) }
    }

    async function remove(cid){ if(!confirm('Eliminar costo?')) return; try{ await api.deleteCostoHumano(cid); load() }catch(err){ alert('Error') } }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Costos Humanos</h3>
                <Link to={`/planes-accion/${id}/costos-humanos/crear`} className="btn bg-primary text-white px-3">Agregar</Link>
            </div>
            <div className="mt-4">
                <table className="w-full">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Actividad</th><th className="px-4 py-2">Acción</th><th className="px-4 py-2">Tiempo</th><th className="px-4 py-2">Cantidad</th><th className="px-4 py-2">Costo</th><th className="px-4 py-2">Monto</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {costos.map(c=> (
                            <tr key={c.id}>
                                <td className="px-4 py-2">{c.id}</td>
                                <td className="px-4 py-2">{c.actividad}</td>
                                <td className="px-4 py-2">{c.accion}</td>
                                <td className="px-4 py-2">{c.tiempo}</td>
                                <td className="px-4 py-2">{c.cantidad}</td>
                                <td className="px-4 py-2">{c.costo}</td>
                                <td className="px-4 py-2">{c.monto}</td>
                                <td className="px-4 py-2"><Link to={`/costos-humanos/${c.id}`} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Ver</Link><button onClick={()=>remove(c.id)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
