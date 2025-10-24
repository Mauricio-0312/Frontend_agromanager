import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function UserDetail(){
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{ load() }, [id])

    async function load(){
        setLoading(true)
        try{
            const res = await api.getUser(id)
            setUserData(res.data)
        }catch(err){
            console.error('getUser error', err)
            setUserData(null)
        }finally{ setLoading(false) }
    }

    if (loading) return <div className="p-6">Cargando...</div>
    if (!userData || !userData.user) return <div className="p-6">Usuario no encontrado. <Link to="/users" className="text-blue-600">Volver</Link></div>

    const user = userData.user
    const projects = userData.projects || []

    const fmt = (s) => {
        if (!s) return '-'
        try { return new Date(s).toLocaleDateString() } catch { return s }
    }

    const initials = (u) => {
        const name = u.Name || u.name || ''
        if (name.trim()) {
            return name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()
        }
        const email = u.Email || u.email || ''
        return email.slice(0,2).toUpperCase()
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800">{user.Name || user.name}</h3>
                        <div className="text-sm text-gray-500">{user.Email || user.email}</div>
                        <div className="mt-2 text-xs text-gray-500">Rol: <span className="font-medium text-gray-700">{user.Role || user.role}</span></div>
                    </div>
                    <Link to="/users" className="btn bg-gray-100 text-gray-700 px-3 py-1 rounded">Volver</Link>
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Proyectos del usuario</h4>
                    {projects.length === 0 ? (
                        <div className="text-sm text-gray-500">Este usuario no pertenece a ningún proyecto</div>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map(p=> (
                                <div key={p.ID || p.id} className="bg-white border rounded p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h5 className="text-lg font-medium">{p.Name || p.name}</h5>
                                            <div className="text-sm text-gray-500 mt-1">{p.Description || p.description}</div>
                                        </div>
                                        <div className="text-sm text-gray-500">{fmt(p.StartDate || p.start_date)} - {fmt(p.EndDate || p.end_date)}</div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-3">
                                        { (p.Users || p.users || []).map(u=> (
                                            <div key={u.ID || u.id || u.Email || u.email} className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 font-semibold">{initials(u)}</div>
                                                <div className="text-sm text-gray-700">{u.Name || u.name || u.Email || u.email}</div>
                                            </div>
                                        )) }
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
