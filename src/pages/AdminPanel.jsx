import React, { useEffect, useState } from 'react'
import { api } from '../api'


export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({ email: '', password: '', role: 'user', name: '' })


    useEffect(() => { 
        load()
    }, [])
    async function load() {
        try {
            const res = await api.fetchUsers()
            console.log(res)
            setUsers(res.data)
        } catch (err) { console.error(err) }
    }


    async function create(e) {
        e.preventDefault()
        try {
            var data = await api.createUser(form)
            console.log(data)
            setForm({ email: '', password: '', role: 'user', name: '' })
            load()
        } catch (err) { alert(err.response?.data?.error || 'Error') }
    }


    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
                <h3 className="text-lg font-semibold">Usuarios</h3>
                <table className="w-full mt-3">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">Email</th><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Rol</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.ID}><td className="px-4 py-2">{u.Email}</td><td className="px-4 py-2">{u.Name}</td><td className="px-4 py-2">{u.Role}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Crear usuario</h3>
                <form onSubmit={create} className="flex flex-col gap-2">
                    <input className="p-2 border rounded" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <select className="p-2 border rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                    <button className="btn bg-primary text-white py-2 rounded">Crear usuario</button>
                </form>
            </div>
        </div>
    )
}