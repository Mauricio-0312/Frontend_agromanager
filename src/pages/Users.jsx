import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

export default function Users(){
    const [users, setUsers] = useState([])
    const [editing, setEditing] = useState(null)

    useEffect(()=>{ load() }, [])

    async function load(){
        try{ const res = await api.fetchUsers(); setUsers(res.data) }catch(err){ console.error(err) }
    }

    async function remove(id){ if(!confirm('Eliminar usuario?')) return; try{ await api.deleteUser(id); load() }catch(err){ alert('Error') } }

    function startEdit(u){ setEditing(u) }
    async function saveEdit(e){ e.preventDefault(); try{ const payload = { name: e.target.name.value, role: e.target.role.value }; await api.updateUser(editing.ID || editing.id, payload); setEditing(null); load() }catch(err){ alert('Error') } }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold">Usuarios</h3>
                <table className="w-full mt-3">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">Email</th><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Rol</th><th className="px-4 py-2">Acciones</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.ID || u.id || u.Email || u.email}>
                                <td className="px-4 py-2">{u.Email || u.email}</td>
                                <td className="px-4 py-2"><Link to={`/users/${u.ID || u.id}`} >{u.Name || u.name}</Link></td>
                                <td className="px-4 py-2">{u.Role || u.role}</td>
                                <td className="px-4 py-2"><button onClick={()=>startEdit(u)} className="mr-2 btn bg-blue-500 text-white px-2 py-1 rounded">Editar</button><button onClick={()=>remove(u.ID || u.id)} className="btn bg-red-500 text-white px-2 py-1 rounded">Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Editar usuario</h3>
                {editing ? (
                    <form onSubmit={saveEdit} className="flex flex-col gap-2">
                        <input name="name" defaultValue={editing.Name || editing.name} className="p-2 border rounded" />
                        <select name="role" defaultValue={editing.Role || editing.role} className="p-2 border rounded">
                            {/* <option value="user">user</option> */}
                            <option value="admin">admin</option>
                            <option value="analista">analista</option>
                            <option value="vendedor">vendedor</option>
                        </select>
                        <div className="flex gap-2"><button className="btn bg-primary text-white px-2 py-2 rounded">Guardar</button><button type="button" onClick={()=>setEditing(null)} className="btn bg-gray-200 px-2 py-2 rounded">Cancelar</button></div>
                    </form>
                ) : (
                    <div className="text-sm text-gray-500">Selecciona un usuario para editar</div>
                )}
            </div>
        </div>
    )
}
