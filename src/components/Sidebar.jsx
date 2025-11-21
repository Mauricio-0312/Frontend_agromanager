import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Sidebar() {
    const { user } = useContext(AuthContext)
    return (
        <aside className="sidebar hidden md:block">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary">AgroManager</h2>
                <p className="text-sm text-gray-500 mt-1">Gestión agrícola</p>
            </div>


            <nav className="flex flex-col gap-2">
                {/* <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Dashboard</NavLink> */}
                {user && (
                    <>
                        <NavLink to="/projects" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Proyectos</NavLink>
                        {/* Equipos: visible a todos los usuarios con proyectos (gerentes/managers) */}
                        <NavLink to="/equipos" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Equipos</NavLink>
                        <NavLink to="/activities" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Actividades</NavLink>
                    </>
                )}
                {user && user.role === 'admin' && (
                    <>
                        <NavLink to="/users" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Usuarios</NavLink>
                        <NavLink to="/admin" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Administración</NavLink>
                        <NavLink to="/units" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Unidades de medidas</NavLink>
                        <NavLink to="/logs" className={({ isActive }) => `px-3 py-2 rounded ${isActive ? 'bg-green-50 font-medium' : 'text-gray-700'}`}>Logger de Eventos</NavLink>
                    </>
                )}
            </nav>


            <div className="mt-6 text-xs text-gray-500">© {new Date().getFullYear()} AgroManager</div>
        </aside>
    )
}