import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function CostoHumanoForm(){
    const { id } = useParams() // id = plan id for create, or costo id for edit
    const location = useLocation()
    // robust detection for create/edit
    const isEdit = /^\/costos-humanos\/\d+/.test(location.pathname)
    const isCreate = location.pathname.includes('/costos-humanos/crear') || location.pathname.endsWith('/crear') || /\/planes-accion\/\d+\/costos-humanos\/crear/.test(location.pathname)
    const navigate = useNavigate()
    const [form, setForm] = useState({ actividad:'', accion:'', accion_label:'', tiempo:0, cantidad:1, costo:0, responsable_id:null, responsable_label:'', monto:0 })
    const [users, setUsers] = useState([])
    const [labores, setLabores] = useState([])

    useEffect(()=>{ loadUsers(); loadLabores(); if(isCreate){ loadPlan() } if(isEdit){ loadCosto() } }, [])

    async function loadUsers(){ try{ const res = await api.fetchUsers(); setUsers(res.data); setForm(f=>{
            if(f.responsable_id){
                const found = res.data.find(u=>u.id === f.responsable_id || u.ID === f.responsable_id)
                if(found) return {...f, responsable_label: found.email || found.Email || ''}
            }
            return f
        }) }catch(err){ console.error(err) } }
    async function loadLabores(){ try{ const res = await api.fetchLabores(); setLabores(res.data); setForm(f=>{
            // if accion looks like an id (numeric) try to find label
            const val = f.accion
            if(val){
                const id = parseInt(val)
                if(!isNaN(id)){
                    const found = res.data.find(l => Number(l.id) === id)
                    if(found){
                        return {...f, accion_label: found.descripcion || found.Descripcion || found.name || found.nombre}
                    }
                }
            }
            return f
        }) }catch(err){ console.error(err) } }
    async function loadPlan(){
        try{
            const res = await api.getPlanAccion(id)
            const p = res.data
            // p.accion might be text or an id; store raw value and fill label if available
            setForm(f=> ({...f, accion: p.accion || '', accion_label: p.accion || '', responsable_id: p.responsable?.id || p.responsable_id || null, responsable_label: p.responsable?.email || '' }))
        }catch(err){ console.error('loadPlan error', err) }
    }
    async function loadCosto(){
        try{
            const res = await api.getCostoHumano(id)
            const c = res.data
            setForm({
                actividad: c.actividad || '',
                accion: c.accion || '',
                accion_label: c.accion || '',
                tiempo: c.tiempo || 0,
                cantidad: c.cantidad || 1,
                costo: c.costo || 0,
                responsable_id: c.responsable?.id || c.responsable_id || null,
                responsable_label: c.responsable?.email || '',
                monto: c.monto || 0,
            })
        }catch(err){ console.error(err) }
    }

    function calcMonto(){ return form.tiempo * form.costo * form.cantidad }

    async function save(e){
        e.preventDefault()
        const payload = {
            actividad: form.actividad,
            accion: form.accion,
            tiempo: form.tiempo,
            cantidad: form.cantidad,
            costo: form.costo,
            responsable_id: form.responsable_id
        }
        try{
            console.log('CostoHumanoForm save: isCreate=', isCreate, 'isEdit=', isEdit, 'id=', id, 'payload=', payload)
            if(isCreate){
                await api.createCostoHumano(id, payload)
            } else if(isEdit){
                await api.updateCostoHumano(id, payload)
            } else {
                // fallback try create
                await api.createCostoHumano(id, payload)
            }
            navigate(-1)
        }catch(err){
            console.error('save error', err.response?.data || err)
            alert(err.response?.data?.error || 'Error')
        }
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold">{isCreate ? 'Agregar costo humano' : 'Editar costo humano'}</h3>
            <form onSubmit={save} className="flex flex-col gap-2 mt-3">
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Actividad</span>
                    <input id="actividad" value={form.actividad} onChange={e=>setForm({...form, actividad:e.target.value})} placeholder="Actividad" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Acción</span>
                    <select id="accion" value={form.accion||''} className="p-2 border rounded" disabled>
                        {form.accion_label ? <option value={form.accion}>{form.accion_label}</option> : <option value="">-- Acción (preestablecido desde Plan) --</option>}
                        {labores.map(l=> <option key={l.id} value={l.descripcion || l.Descripcion || l.name || l.nombre}>{l.descripcion || l.Descripcion || l.name || l.nombre}</option>)}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Tiempo (horas)</span>
                    <input id="tiempo" type="number" value={form.tiempo} onChange={e=>setForm({...form, tiempo: parseFloat(e.target.value||0)})} placeholder="Tiempo (horas)" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Cantidad (personas)</span>
                    <input id="cantidad" type="number" value={form.cantidad} onChange={e=>setForm({...form, cantidad: parseInt(e.target.value||1)})} placeholder="Cantidad (personas)" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Costo por unidad</span>
                    <input id="costo" type="number" value={form.costo} onChange={e=>setForm({...form, costo: parseFloat(e.target.value||0)})} placeholder="Costo por unidad" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Responsable</span>
                    <select id="responsable" value={form.responsable_id||''} className="p-2 border rounded" disabled>
                        {form.responsable_label ? <option value={form.responsable_id}>{form.responsable_label}</option> : (form.responsable_id ? <option value={form.responsable_id}>{users.find(u=>u.id===form.responsable_id)?.email || 'Responsable'}</option> : <option value="">-- Responsable (preestablecido desde Plan) --</option>)}
                        {users.map(u=> <option key={u.id} value={u.id}>{u.email}</option>)}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Monto</span>
                    <input type="number" value={calcMonto().toFixed(2)} readOnly className="p-2 border rounded bg-gray-100" />
                </label>
                <div className="flex gap-2"><button className="btn bg-primary text-white px-3">Guardar</button><button type="button" onClick={()=>navigate(-1)} className="btn bg-gray-200 px-3">Cancelar</button></div>
            </form>
        </div>
    )
}
