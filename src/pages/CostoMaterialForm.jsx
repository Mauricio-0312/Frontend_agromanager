import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function CostoMaterialForm(){
    const { id, action } = useParams() // id = plan id for create, or costo id for edit
    const location = useLocation()
    // robust detection: edit when path is /costos-materiales/:id, create when path contains /costos-materiales/crear (including under /planes-accion/:id)
    const isEdit = /^\/costos-materiales\/\d+/.test(location.pathname)
    const isCreate = /\/costos-materiales\/crear(\/|$)/.test(location.pathname) || /\/planes-accion\/\d+\/costos-materiales\/crear/.test(location.pathname)
    const navigate = useNavigate()
    const [form, setForm] = useState({ actividad:'', accion:'', accion_label:'', categoria:1, descripcion:'', cantidad:0, unidad_id:null, costo:0, responsable_id:null, responsable_label:'', monto:0 })
    const [units, setUnits] = useState([])
    const [users, setUsers] = useState([])
    const [labores, setLabores] = useState([])

    async function loadLabores(){ try{ const res = await api.fetchLabores(); setLabores(res.data); setForm(f=>{
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
            setForm(f=> ({...f, accion: p.accion || '', accion_label: p.accion || '', responsable_id: p.responsable?.id || p.responsable_id || null, responsable_label: p.responsable?.email || '' }))
        }catch(err){ console.error('loadPlan error', err) }
    }
    useEffect(()=>{
        // load in order: if editing, fetch the costo first so form is prefilled, then load lists to resolve labels
        async function init(){
            try{
                if(isEdit){
                    console.log('CostoMaterialForm: editing mode, loading costo id=', id)
                    await loadCosto()
                } else if(isCreate){
                    console.log('CostoMaterialForm: create mode, loading plan id=', id)
                    await loadPlan()
                }
                await Promise.all([loadUnits(), loadUsers(), loadLabores()])
                console.log('CostoMaterialForm: init done')
            }catch(err){ console.error('init error', err) }
        }
        init()
    }, [])

    async function loadUnits(){ try{ const res = await api.fetchUnits(); setUnits(res.data) }catch(err){ console.error(err) } }
    async function loadUsers(){ try{ const res = await api.fetchUsers(); setUsers(res.data); setForm(f=>{
            if(f.responsable_id){
                const found = res.data.find(u=>u.id === f.responsable_id || u.ID === f.responsable_id)
                if(found) return {...f, responsable_label: found.email || found.Email || ''}
            }
            return f
        }) }catch(err){ console.error(err) } }
    async function loadCosto(){
        try{
            const res = await api.getCostoMaterial(id)
            console.log('loadCosto material response', res.data)
            const c = res.data
            setForm({
                actividad: c.actividad || '',
                accion: c.accion || '',
                accion_label: c.accion || '',
                categoria: c.categoria || 1,
                descripcion: c.descripcion || '',
                cantidad: c.cantidad || 0,
                unidad_id: c.unidad?.id || c.unidad_id || null,
                costo: c.costo || 0,
                responsable_id: c.responsable?.id || c.responsable_id || null,
                responsable_label: c.responsable?.email || c.responsable?.Email || '',
                monto: c.monto || 0,
            })
        }catch(err){ console.error('loadCosto error', err.response?.data || err) }
    }

    function calcMonto(){ return form.cantidad * form.costo }

    async function save(e){
        e.preventDefault()
        const payload = {
            actividad: form.actividad,
            accion: form.accion,
            categoria: form.categoria,
            descripcion: form.descripcion,
            cantidad: form.cantidad,
            unidad_id: form.unidad_id,
            costo: form.costo,
            responsable_id: form.responsable_id
        }
        try{
            if(isCreate){
                await api.createCostoMaterial(id, payload)
            } else if(isEdit){
                await api.updateCostoMaterial(id, payload)
            } else {
                await api.createCostoMaterial(id, payload)
            }
            navigate(-1)
        }catch(err){
            console.error('save error', err.response?.data || err)
            alert(err.response?.data?.error || 'Error')
        }
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold">{action === 'crear' ? 'Agregar costo material' : 'Editar costo material'}</h3>
            <form onSubmit={save} className="flex flex-col gap-2 mt-3">
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Actividad</span>
                    <input id="actividad" value={form.actividad} onChange={e=>setForm({...form, actividad:e.target.value})} placeholder="Actividad" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Acción</span>
                    <select id="accion" value={form.accion||''} className="p-2 border rounded" disabled>
                        {form.accion_label ? <option value={form.accion}>{form.accion_label}</option> : <option value="">-- Acción (preestablecido desde Plan) --</option>}
                        {labores.map(l=> (
                            <option key={l.id} value={l.descripcion || l.Descripcion || l.name || l.nombre}>{l.descripcion || l.Descripcion || l.name || l.nombre}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Categoría</span>
                    <select id="categoria" value={form.categoria} onChange={e=>setForm({...form, categoria: parseInt(e.target.value)})} className="p-2 border rounded">
                        <option value={1}>Materiales</option>
                        <option value={2}>Insumos</option>
                        <option value={3}>Equipos</option>
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Descripción</span>
                    <input id="descripcion" value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} placeholder="Descripción" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Cantidad</span>
                    <input id="cantidad" type="number" value={form.cantidad} onChange={e=>setForm({...form, cantidad: parseFloat(e.target.value||0)})} placeholder="Cantidad" className="p-2 border rounded" />
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Unidad</span>
                    <select id="unidad" value={form.unidad_id||''} onChange={e=>setForm({...form, unidad_id: e.target.value ? parseInt(e.target.value) : null})} className="p-2 border rounded">
                        <option value="">-- Unidad --</option>
                        {units.map(u=> <option key={u.id} value={u.id}>{u.unit}</option>)}
                    </select>
                </label>
                <label className="flex flex-col text-sm">
                    <span className="font-medium">Costo</span>
                    <input id="costo" type="number" value={form.costo} onChange={e=>setForm({...form, costo: parseFloat(e.target.value||0)})} placeholder="Costo" className="p-2 border rounded" />
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
