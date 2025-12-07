import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function PlanAccionForm(){
    const { id } = useParams() // id = project id for create, or plan id for edit
    const navigate = useNavigate()
    const location = useLocation()
    const isCreating = location.pathname.includes('/crear')
    const [form, setForm] = useState({ actividad:'', accion:'', fecha_inicio:'', fecha_cierre:'', cantidad_horas:0, responsable_id:null, monto:0 })
    const [users, setUsers] = useState([])
    const [labores, setLabores] = useState([])

    useEffect(()=>{ loadUsers(); loadLabores(); if(!isCreating) loadPlan() }, [])

    async function loadUsers(){ try{ const res = await api.fetchUsers(); setUsers(res.data) }catch(err){ console.error(err) } }
    async function loadLabores(){ try{ const res = await api.fetchLabores(); setLabores(res.data) }catch(err){ console.error(err) } }
    async function loadPlan(){ try{ const res = await api.getPlanAccion(id); const p = res.data; setForm({ actividad:p.actividad||'', accion:p.accion||'', fecha_inicio:p.fecha_inicio||'', fecha_cierre:p.fecha_cierre||'', cantidad_horas:p.cantidad_horas||0, responsable_id:p.responsable?.id||p.responsable_id||null, monto:p.monto||0 }) }catch(err){ console.error(err) } }

    function calcMonto(){ // optional: keep as manual or derive
        return form.monto
    }

    async function save(e){
        e.preventDefault()
        const payload = {
            actividad: form.actividad,
            accion: form.accion,
            fecha_inicio: form.fecha_inicio ? new Date(form.fecha_inicio).toISOString() : null,
            fecha_cierre: form.fecha_cierre ? new Date(form.fecha_cierre).toISOString() : null,
            cantidad_horas: Number(form.cantidad_horas) || 0,
            responsable_id: form.responsable_id || null,
            monto: Number(form.monto) || 0
        }
        console.log('Plan payload:', payload, 'isCreating=', isCreating, 'id=', id)
        try{
            if(isCreating){
                // id here is project id
                await api.createPlanAccion(id, payload)
                navigate(`/projects/${id}`)
            } else {
                // id here is plan id
                await api.updatePlanAccion(id, payload)
                navigate(-1)
            }
        }catch(err){
            console.error('createPlan error', err)
            alert(err.response?.data?.error || err.message || 'Error')
        }
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold">{isCreating ? 'Crear Plan' : 'Editar Plan'}</h3>
            <form onSubmit={save} className="flex flex-col gap-2 mt-3">
                <label className="text-sm">Actividad</label>
                <input value={form.actividad} onChange={e=>setForm({...form, actividad:e.target.value})} placeholder="Actividad" className="p-2 border rounded" />
                <label className="text-sm">Acción</label>
                <select value={form.accion||''} onChange={e=>setForm({...form, accion:e.target.value})} className="p-2 border rounded">
                    <option value="">-- Seleccionar acción / labor --</option>
                    {labores.map(l => (
                        <option key={l.id} value={l.descripcion || l.Descripcion}>{l.descripcion || l.Descripcion}</option>
                    ))}
                </select>
                <label className="text-sm">Fecha inicio</label>
                <input type="date" value={form.fecha_inicio ? form.fecha_inicio.split('T')[0] : ''} onChange={e=>setForm({...form, fecha_inicio: e.target.value})} className="p-2 border rounded" />
                <label className="text-sm">Fecha cierre</label>
                <input type="date" value={form.fecha_cierre ? form.fecha_cierre.split('T')[0] : ''} onChange={e=>setForm({...form, fecha_cierre: e.target.value})} className="p-2 border rounded" />
                <label className="text-sm">Cantidad horas</label>
                <input type="number" value={form.cantidad_horas} onChange={e=>setForm({...form, cantidad_horas: parseInt(e.target.value||0)})} placeholder="Cantidad horas" className="p-2 border rounded" />
                <label className="text-sm">Responsable</label>
                <select value={form.responsable_id||''} onChange={e=>setForm({...form, responsable_id: e.target.value ? parseInt(e.target.value) : null})} className="p-2 border rounded">
                    <option value="">-- Responsable --</option>
                    {users.map(u=> <option key={u.id} value={u.id}>{u.email}</option>)}
                </select>
                <label className="text-sm">Monto</label>
                <input type="number" value={form.monto} readOnly className="p-2 border rounded bg-gray-100" />
                <div className="flex gap-2"><button className="btn bg-primary text-white px-3">Guardar</button><button type="button" onClick={()=>navigate(-1)} className="btn bg-gray-200 px-3">Cancelar</button></div>
            </form>
        </div>
    )
}
