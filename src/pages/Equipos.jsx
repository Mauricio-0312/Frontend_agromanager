import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Equipos(){
    const [items, setItems] = useState([])
    const [editing, setEditing] = useState(null)

    useEffect(()=>{ load() }, [])

    async function load(){ try{ const res = await api.fetchEquipos(); setItems(res.data) }catch(err){ console.error(err) } }

    async function save(e){ e.preventDefault(); const desc = e.target.descripcion.value; try{ if(editing){ await api.updateEquipo(editing.id || editing.ID, { descripcion: desc }) } else { await api.createEquipo({ descripcion: desc }) } setEditing(null); e.target.reset(); load() }catch(err){ alert('Error') } }
    async function remove(id){ if(!confirm('Eliminar?')) return; try{ await api.deleteEquipo(id); load() }catch(err){ alert('Error') } }
    function startEdit(it){ setEditing(it) }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold">Equipos e Implementos</h3>
                <table className="w-full mt-3">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">ID</th><th className="px-4 py-2">Descripción</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {items.map(u => (
                            <tr key={u.id || u.ID}>
                                <td className="px-4 py-2">{u.id || u.ID}</td>
                                <td className="px-4 py-2">{u.descripcion}</td>
                                <td className="px-4 py-2"><button onClick={()=>startEdit(u)} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Editar</button><button onClick={()=>remove(u.id || u.ID)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Crear / Editar</h3>
                <form onSubmit={save} className="flex flex-col gap-2">
                    <input name="descripcion" defaultValue={editing ? (editing.descripcion || editing.Descripcion) : ''} placeholder="Descripción" className="p-2 border rounded" />
                    <div className="flex gap-2"><button className="btn bg-primary text-white px-2 py-2 rounded">Guardar</button><button type="button" onClick={()=>setEditing(null)} className="btn bg-gray-200 px-2 py-2 rounded">Cancelar</button></div>
                </form>
            </div>
        </div>
    )
}
