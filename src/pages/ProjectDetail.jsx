import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function ProjectDetail(){
    const { id } = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{ load() }, [id])

    async function load(){
        setLoading(true)
        try{
            const res = await api.getProject(id)
            setProject(res.data)
        }catch(err){
            console.error('getProject error', err)
            setProject(null)
        }finally{
            setLoading(false)
        }
    }

    const fmt = (s) => {
        if (!s) return '-'
        try { return new Date(s).toLocaleDateString() } catch { return s }
    }

    const statusColor = (s) => {
        const st = (s || '').toString().toLowerCase()
        if (st === 'activo' || st === 'active') return 'bg-green-100 text-green-800'
        if (st === 'cerrado' || st === 'closed') return 'bg-red-100 text-red-800'
        if (st === 'pausado' || st === 'paused') return 'bg-yellow-100 text-yellow-800'
        return 'bg-gray-100 text-gray-800'
    }

    const initials = (u) => {
        const name = u.Name || u.name || ''
        if (name.trim()) {
            return name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()
        }
        const email = u.Email || u.email || ''
        return email.slice(0,2).toUpperCase()
    }

    if (loading) return <div className="p-6">Cargando...</div>
    if (!project) return <div className="p-6">Proyecto no encontrado. <Link to="/projects" className="text-blue-600">Volver</Link></div>

    const users = project.Users || project.users || []

    return (
        <div className="card">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">{project.Name || project.name}</h3>
                    <div className="mt-2 text-sm text-gray-500">ID: <span className="font-mono text-xs text-gray-600">{project.ID || project.id}</span></div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(project.Status || project.status)}`}>
                        {project.Status || project.status || 'desconocido'}
                    </span>
                    <Link to="/projects" className="btn bg-gray-100 text-gray-700 px-3 py-1 rounded">Volver</Link>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="bg-white border rounded p-4 shadow-sm">
                        <h4 className="text-sm text-gray-500 mb-2">Descripción</h4>
                        <div className="text-gray-700 text-sm whitespace-pre-wrap">{project.Description || project.description || 'Sin descripción'}</div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white border rounded p-3 shadow-sm">
                            <div className="text-xs text-gray-500">Fecha inicio</div>
                            <div className="text-sm font-medium text-gray-800">{fmt(project.StartDate || project.start_date)}</div>
                        </div>
                        <div className="bg-white border rounded p-3 shadow-sm">
                            <div className="text-xs text-gray-500">Fecha fin</div>
                            <div className="text-sm font-medium text-gray-800">{fmt(project.EndDate || project.end_date)}</div>
                        </div>
                    </div>
                </div>

                <aside className="bg-white border rounded p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Participantes</h4>
                        <div className="text-xs text-gray-400">{users.length} participantes</div>
                    </div>

                    <div className="mt-3">
                        {users.length === 0 ? (
                            <div className="text-sm text-gray-500">Sin participantes asignados</div>
                        ) : (
                            <ul className="space-y-2">
                                {users.map(u=> (
                                    <li key={u.ID || u.id || u.Email || u.email} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-700 font-semibold">{initials(u)}</div>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-800">{u.Name || u.name || u.Email || u.email}</div>
                                            <div className="text-xs text-gray-500">{u.Email || u.email}</div>
                                        </div>
                                        <div className="text-xs text-gray-500">{u.Role || u.role || '-'}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}
