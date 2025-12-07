import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Logs(){
    const [logs, setLogs] = useState([])
    const [q, setQ] = useState('')
    const [day, setDay] = useState('')
    const [date, setDate] = useState('')
    const [month, setMonth] = useState('')
    const [quarter, setQuarter] = useState('')
    const [year, setYear] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [error, setError] = useState('')

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
                    <button onClick={async ()=>{ const res = await api.fetchLogs({ q }); setLogs(res.data) }} className="btn bg-primary text-white px-3">Buscar</button>
                </div>
            </div>

            {/* Advanced filters */}
            <div className="mt-4 p-4 border rounded bg-white">
                <h4 className="font-medium mb-2">Filtros avanzados</h4>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <div>
                        <label className="text-sm">Por día</label>
                        <input type="date" className="p-2 border rounded w-full" value={day} onChange={e=>setDay(e.target.value)} />
                    </div>
                <div className="grid grid-cols-2 gap-2">
                    {/* <div>
                        <label className="text-sm">Por fecha (date)</label>
                        <input type="date" className="p-2 border rounded w-full" value={date} onChange={e=>setDate(e.target.value)} />
                    </div> */}
                    <div>
                        <label className="text-sm">Por mes</label>
                        <div className="flex gap-2">
                            <select className="p-2 border rounded flex-1" value={month} onChange={e=>setMonth(e.target.value)}>
                                <option value="">Mes</option>
                                {Array.from({length:12}).map((_,i)=>(<option key={i+1} value={i+1}>{i+1}</option>))}
                            </select>
                            <input type="number" placeholder="Año" className="p-2 border rounded w-24" value={year} onChange={e=>setYear(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Por trimestre</label>
                        <div className="flex gap-2">
                            <select className="p-2 border rounded flex-1" value={quarter} onChange={e=>setQuarter(e.target.value)}>
                                <option value="">Trimestre</option>
                                <option value={1}>Q1</option>
                                <option value={2}>Q2</option>
                                <option value={3}>Q3</option>
                                <option value={4}>Q4</option>
                            </select>
                            <input type="number" placeholder="Año" className="p-2 border rounded w-24" value={year} onChange={e=>setYear(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm">Por año</label>
                        <input type="number" placeholder="Año" className="p-2 border rounded w-full" value={year} onChange={e=>setYear(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm">Por periodo</label>
                        <div className="flex gap-2">
                            <input type="date" className="p-2 border rounded flex-1" value={start} onChange={e=>setStart(e.target.value)} />
                            <input type="date" className="p-2 border rounded flex-1" value={end} onChange={e=>setEnd(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex gap-2">
                    <button onClick={async ()=>{
                        setError('')
                        // determine priority and validate
                        try{
                            let params = { q }
                            if(day){ params.day = day }
                            else if(date){ params.date = date }
                            else if(month && year){ params.month = month; params.year = year }
                            else if(quarter && year){ params.quarter = quarter; params.year = year }
                            else if(year && !month && !quarter){ params.year = year }
                            else if(start && end){ params.start = start; params.end = end }
                            else { setError('Seleccione algún filtro') ; return }
                            console.log('Logs filter params:', params)
                            const res = await api.fetchLogs(params)
                            console.log('Logs fetched count=', Array.isArray(res.data) ? res.data.length : 'not-array', res.data)
                            setLogs(res.data)
                        }catch(err){ console.error(err); setError(err.response?.data?.error || 'Error al obtener logs') }
                    }} className="btn bg-primary text-white px-3">Aplicar</button>
                    <button onClick={async ()=>{ setDay(''); setDate(''); setMonth(''); setQuarter(''); setYear(''); setStart(''); setEnd(''); setQ(''); await load() }} className="btn bg-gray-200 px-3">Limpiar filtros</button>
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
