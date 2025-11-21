import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Logs(){
    const [logs, setLogs] = useState([])
    const [q, setQ] = useState('')

    useEffect(()=>{ load() }, [])
    async function load(){
        try{ const res = await api.fetchLogs(); setLogs(res.data) }catch(err){ console.error(err) }
    }

    async function remove(id){ if(!confirm('Esta seguro de eliminar este log?')) return; try{ await api.deleteLog(id); load() }catch(err){ alert('Error') } }

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Logger de Eventos</h3>
                <div className="flex gap-2">
                    <input placeholder="Buscar" className="p-2 border rounded" value={q} onChange={e=>setQ(e.target.value)} />
                    <button onClick={async ()=>{ const res = await api.fetchLogs(q); setLogs(res.data) }} className="btn bg-primary text-white px-3">Buscar</button>
                </div>
            </div>

            <div className="mt-4">
                <table className="w-full">
                    <thead className="text-sm text-gray-500 text-left">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Usuario (email)</th>
                            <th className="px-4 py-2">Módulo</th>
                            <th className="px-4 py-2">Evento</th>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2">Hora</th>
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(l=> (
                            <tr key={l.id}>
                                <td className="px-4 py-2">{l.id}</td>
                                <td className="px-4 py-2">{(l.user && l.user.email) ? l.user.email : (l.user_id || '-')}</td>
                                <td className="px-4 py-2">{l.module}</td>
                                <td className="px-4 py-2">{l.event}</td>
                                <td className="px-4 py-2">{new Date(l.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{new Date(l.created_at).toLocaleTimeString()}</td>
                                <td className="px-4 py-2">
                                    <button onClick={()=>remove(l.id)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
