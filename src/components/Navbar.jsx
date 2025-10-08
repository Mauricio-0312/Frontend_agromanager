import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


export default function Navbar() {
    const { user, logout } = useContext(AuthContext)
    return (
        <header className="navbar">
            <div className="flex items-center gap-4">
                <div className="text-primary font-bold">AgroManager</div>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="text-sm">{user.name || user.email}</div>
                        <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Cerrar sesión</button>
                    </>
                ) : null}
            </div>
        </header>
    )
}