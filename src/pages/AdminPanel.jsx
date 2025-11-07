import React, { useEffect, useState } from 'react'
import { api } from '../api'


export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({ email: '', password: '', role: 'user', name: '', dni: '' })


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
            setForm({ email: '', password: '', role: 'user', name: '', dni: '' })
            load()
        } catch (err) { alert(err.response?.data?.error || 'Error') }
    }

    async function exportUsers() {
        try {
            const res = await api.exportUsers()
            const url = window.URL.createObjectURL(res.data)
            const a = document.createElement('a')
            a.href = url
            a.download = 'users.csv'
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('exportUsers error', err)
            alert('Error exporting users')
        }
    }


    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Usuarios</h3>
                    <button onClick={exportUsers} className="btn bg-gray-100 text-gray-700 px-3 py-1 rounded">Exportar CSV</button>
                </div>
                <table className="w-full mt-3">
                    <thead className="text-sm text-gray-500 text-left"><tr><th className="px-4 py-2">Email</th><th className="px-4 py-2">Nombre</th><th className="px-4 py-2">Cédula</th><th className="px-4 py-2">Rol</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}><td className="px-4 py-2">{u.Email || u.email}</td><td className="px-4 py-2">{u.Name || u.name}</td><td className="px-4 py-2">{u.dni || u.Dni || ''}</td><td className="px-4 py-2">{u.Role || u.role}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="card">
                <h3 className="text-lg font-semibold mb-3">Crear usuario</h3>
                <form onSubmit={create} className="flex flex-col gap-2">
                    <input className="p-2 border rounded" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Cédula" value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <select className="p-2 border rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        {/* <option value="user">user</option> */}
                        <option value="admin">admin</option>
                        <option value="analista">analista</option>
                        <option value="vendedor">vendedor</option>
                    </select>
                    <button className="btn bg-primary text-white py-2 rounded">Crear usuario</button>
                </form>
            </div>
        </div>
    )
}