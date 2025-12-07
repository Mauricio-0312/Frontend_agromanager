import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'

export default function ProjectDetail(){
    const { id } = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    // data for activities form (must be declared unconditionally to preserve hooks order)
    const [labores, setLabores] = useState([])
    const [equipos, setEquipos] = useState([])
    const [allUsers, setAllUsers] = useState([])

    useEffect(()=>{ load() }, [id])

    useEffect(()=>{
        // load labors, equipos and users to populate form selects
        async function loadMeta(){
            try{
                const [lr, er, ur] = await Promise.all([api.fetchLabores(), api.fetchEquipos(), api.fetchUsers()])
                setLabores(lr.data)
                setEquipos(er.data)
                setAllUsers(ur.data)
            }catch(err){ console.error('meta load error', err) }
        }
        loadMeta()
    }, [])

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
            {/* Actividades Agrícolas */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Actividades</h4>
                <div className="space-y-3">
                    {(project.Activities || project.activities || []).length === 0 ? (
                        <div className="text-sm text-gray-500">Sin actividades registradas</div>
                    ) : (
                        (project.Activities || project.activities || []).map(a => (
                            <div key={a.ID || a.id} className="bg-white border rounded p-3 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{a.actividad || a.Actividad}</div>
                                        <div className="text-xs text-gray-500">{fmt(a.fecha || a.Fecha)}</div>
                                    </div>
                                    <div className="text-sm text-gray-600">Encargado: {a.encargado ? (a.encargado.Name || a.encargado.name) : (a.Encargado ? (a.Encargado.Name || a.Encargado.name) : '-')}</div>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">Labor: {a.labor_agronomica ? a.labor_agronomica.descripcion : (a.LaborAgronomica ? a.LaborAgronomica.Descripcion || a.LaborAgronomica.Descripcion : '-')}</div>
                                <div className="mt-2 text-sm text-gray-700">Equipos: {(a.equipos || a.Equipos || []).map(e=>e.descripcion || e.Descripcion).join(', ') || '-'}</div>
                                <div className="mt-2 text-sm text-gray-500">Recursos humanos: {a.recurso_humano || a.RecursoHumano || 0} — Costo: {a.costo || a.Costo || 0}</div>
                                { (a.observaciones || a.Observaciones) && <div className="mt-2 text-sm text-gray-600">Observaciones: {a.observaciones || a.Observaciones}</div> }
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Form para agregar actividad */}
            <div className="mt-6 bg-white border rounded p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-3">Agregar Actividad</h4>
                <form onSubmit={async (e)=>{
                    e.preventDefault()
                    const form = e.target
                    const fechaVal = form.fecha.value
                    const fecha = fechaVal ? new Date(fechaVal).toISOString() : null
                    const actividad = form.actividad.value
                    const labor = form.labor.value || null
                    const encargado = form.encargado.value || null
                    const recurso = parseInt(form.recurso.value || '0') || 0
                    const costo = parseFloat(form.costo.value || '0') || 0
                    const observ = form.observaciones.value || ''
                    const equiposSelected = Array.from(form.equipos.selectedOptions || []).map(o => parseInt(o.value))
                    const payload = {
                        fecha: fecha,
                        actividad: actividad,
                        labor_agronomica_id: labor ? parseInt(labor) : null,
                        equipos_ids: equiposSelected,
                        encargado_id: encargado ? parseInt(encargado) : null,
                        recurso_humano: recurso,
                        costo: costo,
                        observaciones: observ,
                        project_id: parseInt(id)
                    }
                    try{
                        await api.createActividad(payload)
                        form.reset()
                        await load()
                    }catch(err){ console.error('create actividad', err); alert('Error creando actividad') }
                }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-500">Fecha</label>
                        <input name="fecha" type="date" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Actividad</label>
                        <input name="actividad" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Labor Agronómica</label>
                        <select name="labor" className="p-2 border rounded w-full">
                            <option value="">-- seleccionar --</option>
                            {labores.map(l=> <option key={l.id || l.ID} value={l.id || l.ID}>{l.descripcion || l.Descripcion}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Encargado</label>
                        <select name="encargado" className="p-2 border rounded w-full">
                            <option value="">-- seleccionar --</option>
                            {allUsers.map(u=> <option key={u.id || u.ID} value={u.id || u.ID}>{u.name || u.Name || u.email || u.Email}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Equipos (multi)</label>
                        <select name="equipos" multiple className="p-2 border rounded w-full h-28">
                            {equipos.map(e=> <option key={e.id || e.ID} value={e.id || e.ID}>{e.descripcion || e.Descripcion}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Recurso humano</label>
                        <input name="recurso" type="number" min="0" className="p-2 border rounded w-full" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">Costo</label>
                        <input name="costo" type="number" step="0.01" min="0" className="p-2 border rounded w-full" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-500">Observaciones</label>
                        <textarea name="observaciones" className="p-2 border rounded w-full" />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                        <button className="btn bg-primary text-white px-3 py-2 rounded">Agregar Actividad</button>
                        <button type="button" onClick={()=>{ /* reset handled by form.reset() above */ }} className="btn bg-gray-200 px-3 py-2 rounded">Cancelar</button>
                    </div>
                </form>
            </div>

            {/* Nuevas secciones: Planes de Acción y Costos */}
            <div className="mt-8">
                <h4 className="text-lg font-semibold mb-3">Planes de Acción</h4>
                <div className="space-y-3">
                    <Link to={`/projects/${id}/planes-accion`} className="block p-4 bg-blue-50 border rounded-lg shadow-sm hover:bg-blue-100 transition">
                        <div className="text-sm font-medium text-blue-700">Ver Planes de Acción</div>
                        <div className="text-xs text-gray-500">Accede y edita los planes de acción del proyecto</div>
                    </Link>
                </div>
            </div>

            {/* <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Costos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to={`/projects/${id}/planes-accion/costos-humano`} className="block p-4 bg-gray-50 border rounded-lg shadow-sm hover:bg-gray-100 transition">
                        <div className="text-sm font-medium text-gray-700">Costos Humanos</div>
                        <div className="text-xs text-gray-500">Detalle de costos por recursos humanos</div>
                    </Link>
                    <Link to={`/projects/${id}/planes-accion/costos-materiales`} className="block p-4 bg-gray-50 border rounded-lg shadow-sm hover:bg-gray-100 transition">
                        <div className="text-sm font-medium text-gray-700">Costos Materiales</div>
                        <div className="text-xs text-gray-500">Detalle de costos por materiales utilizados</div>
                    </Link>
                </div>
            </div> */}
        </div>
    )
}
