import React, { useEffect, useState, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { AuthContext } from '../context/AuthContext'

export default function Projects(){
    const { user } = useContext(AuthContext)
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])
    const [q, setQ] = useState('')
    const [editing, setEditing] = useState(null)
    const createFormRef = useRef(null)
    const editFormRef = useRef(null)

    useEffect(()=>{ load(); loadUsers() }, [])

    async function load(){
        try{
            const res = await api.fetchProjects(q)
            setProjects(res.data)
        }catch(err){ console.error(err) }
    }

    async function loadUsers(){
        try{
            const res = await api.fetchUsers()
            setUsers(res.data)
        }catch(err){ console.error(err) }
    }
    
    async function create(e){
        e.preventDefault()
        const name = e.target.name.value
        const description = e.target.description.value
        const startDateVal = e.target.start_date.value
        const endDateVal = e.target.end_date.value
        const selected = Array.from(e.target.participants ? e.target.participants.selectedOptions : []).map(o=> parseInt(o.value))
        const payload = {
            name,
            description,
            start_date: startDateVal ? new Date(startDateVal).toISOString() : null,
            end_date: endDateVal ? new Date(endDateVal).toISOString() : null,
            user_ids: selected
        }
        try{
            await api.createProject(payload)
            if (createFormRef.current) createFormRef.current.reset()
            else e.target.reset()
            load()
        }catch(err){ alert(err.response?.data?.error || 'Error') }
    }

    async function closeProject(id){
        try{ await api.closeProject(id); load() }catch(err){ alert('Error closing') }
    }

    function startEdit(p){
        setEditing(p)
    }

    function cancelEdit(){
        if (editFormRef.current) editFormRef.current.reset()
        if (createFormRef.current) createFormRef.current.reset()
        setEditing(null)
    }

    async function saveEdit(e){
        e.preventDefault()
        try{
            const selected = Array.from(e.target.participants ? e.target.participants.selectedOptions : []).map(o=> parseInt(o.value))
            const payload = {
                name: e.target.name.value,
                description: e.target.description.value,
                start_date: e.target.start_date.value ? new Date(e.target.start_date.value).toISOString() : null,
                end_date: e.target.end_date.value ? new Date(e.target.end_date.value).toISOString() : null,
                status: e.target.status.value,
                user_ids: selected
            }
            await api.updateProject(editing.ID || editing.id, payload)
            // reset edit form and also clear create form to ensure clean state
            if (editFormRef.current) editFormRef.current.reset()
            if (createFormRef.current) createFormRef.current.reset()
            setEditing(null)
            load()
        }catch(err){ alert(err.response?.data?.error || 'Error updating') }
    }

    async function exportProjectsHandler() {
        try {
            const res = await api.exportProjects()
            const url = window.URL.createObjectURL(res.data)
            const a = document.createElement('a')
            a.href = url
            a.download = 'projects.csv'
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('exportProjects error', err)
            alert('Error exporting projects')
        }
    }

    const fmt = (s) => {
        if (!s) return '-'
        try { return new Date(s).toLocaleDateString() } catch { return s }
    }

    const dateForInput = (s) => {
        if (!s) return ''
        try{
            const d = new Date(s)
            const yyyy = d.getFullYear()
            const mm = String(d.getMonth()+1).padStart(2,'0')
            const dd = String(d.getDate()).padStart(2,'0')
            return `${yyyy}-${mm}-${dd}`
        }catch{ return '' }
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold">Proyectos</h3>
                <div className="mt-3 mb-3 flex gap-2">
                    <input placeholder="Buscar" className="p-2 border rounded" value={q} onChange={e=>setQ(e.target.value)} />
                    <button onClick={load} className="btn bg-primary text-white px-3">Buscar</button>
                    <button onClick={exportProjectsHandler} className="btn bg-gray-100 text-gray-700 px-3">Exportar CSV</button>
                </div>
                <table className="w-full">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Descripción</th><th className="px-4 py-2">Inicio</th><th className="px-4 py-2">Cierre</th><th className="px-4 py-2">Estado</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {projects.map(p=> (
                            <tr key={p.ID || p.id}>
                                <td className="px-4 py-2"><Link to={`/projects/${p.ID || p.id}`}>{p.Name || p.name}</Link></td>
                                <td className="px-4 py-2">{p.Description || p.description}</td>
                                <td className="px-4 py-2">{fmt(p.StartDate || p.start_date)}</td>
                                <td className="px-4 py-2">{fmt(p.EndDate || p.end_date)}</td>
                                <td className="px-4 py-2">{p.Status || p.status}</td>
                                <td className="px-4 py-2">
                                    {user && user.role === 'admin' ? (
                                        <>
                                            <button onClick={()=>startEdit(p)} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
                                            <button onClick={()=>closeProject(p.ID || p.id)} className="btn bg-yellow-500 text-white px-2 py-1 rounded">Cerrar</button>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-500">Solo administradores</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">{editing ? 'Editar proyecto' : 'Crear proyecto'}</h3>
                {user && user.role === 'admin' ? (
                    editing ? (
                        <form ref={editFormRef} onSubmit={saveEdit} className="flex flex-col gap-2">
                            <input name="name" defaultValue={editing.Name || editing.name} placeholder="Nombre" className="p-2 border rounded" />
                            <textarea name="description" defaultValue={editing.Description || editing.description} placeholder="Descripción" className="p-2 border rounded"></textarea>
                            <label className="text-sm">Fecha inicio</label>
                            <input name="start_date" type="date" defaultValue={dateForInput(editing.StartDate || editing.start_date)} className="p-2 border rounded" />
                            <label className="text-sm">Fecha fin</label>
                            <input name="end_date" type="date" defaultValue={dateForInput(editing.EndDate || editing.end_date)} className="p-2 border rounded" />
                            <label className="text-sm">Participantes</label>
                            <select name="participants" multiple className="p-2 border rounded h-32" defaultValue={(editing.Users || editing.users || []).map(u=> u.ID || u.id)}>
                                {users.map(u=> <option key={u.ID || u.id || u.Email || u.email} value={u.ID || u.id}>{u.Email || u.email}</option>)}
                            </select>
                            <label className="text-sm">Estado</label>
                            <select name="status" defaultValue={editing.Status || editing.status} className="p-2 border rounded"><option value="activo">activo</option><option value="cerrado">cerrado</option><option value="pausado">pausado</option></select>
                            <div className="flex gap-2"><button className="btn bg-primary text-white px-2 py-2 rounded">Guardar</button><button type="button" onClick={cancelEdit} className="btn bg-gray-200 px-2 py-2 rounded">Cancelar</button></div>
                        </form>
                    ) : (
                        <form ref={createFormRef} onSubmit={create} className="flex flex-col gap-2">
                            <input name="name" placeholder="Nombre" className="p-2 border rounded" />
                            <textarea name="description" placeholder="Descripción" className="p-2 border rounded"></textarea>
                            <label className="text-sm">Fecha inicio</label>
                            <input name="start_date" type="date" className="p-2 border rounded" />
                            <label className="text-sm">Fecha fin</label>
                            <input name="end_date" type="date" className="p-2 border rounded" />
                            <label className="text-sm">Participantes</label>
                            <select name="participants" multiple className="p-2 border rounded h-32">
                                {users.map(u=> <option key={u.ID || u.id || u.Email || u.email} value={u.ID || u.id}>{u.Email || u.email}</option>)}
                            </select>
                            <button className="btn bg-primary text-white py-2 rounded">Crear</button>
                        </form>
                    )
                ) : (
                    <div className="text-sm text-gray-500">Solo administradores pueden crear o editar proyectos</div>
                )}
            </div>
        </div>
    )
}
