import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function CostoMaterialList(){
    const { id } = useParams()
    const [costos, setCostos] = useState([])

    useEffect(()=>{ load() }, [])

    async function load(){
        try{ const res = await api.getCostosMateriales(id); setCostos(res.data) }catch(err){ console.error(err) }
    }

    async function remove(cid){ if(!confirm('Eliminar costo?')) return; try{ await api.deleteCostoMaterial(cid); load() }catch(err){ alert('Error') } }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Costos Materiales</h3>
                <Link to={`/planes-accion/${id}/costos-materiales/crear`} className="btn bg-primary text-white px-3">Agregar</Link>
            </div>
            <div className="mt-4">
                <table className="w-full">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Actividad</th><th className="px-4 py-2">Descripción</th><th className="px-4 py-2">Cantidad</th><th className="px-4 py-2">Unidad</th><th className="px-4 py-2">Costo</th><th className="px-4 py-2">Monto</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {costos.map(c=> (
                            <tr key={c.id}>
                                <td className="px-4 py-2">{c.id}</td>
                                <td className="px-4 py-2">{c.actividad}</td>
                                <td className="px-4 py-2">{c.descripcion}</td>
                                <td className="px-4 py-2">{c.cantidad}</td>
                                <td className="px-4 py-2">{c.unidad ? c.unidad.unit : '-'}</td>
                                <td className="px-4 py-2">{c.costo}</td>
                                <td className="px-4 py-2">{c.monto}</td>
                                <td className="px-4 py-2"><Link to={`/costos-materiales/${c.id}`} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Ver</Link><button onClick={()=>remove(c.id)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
