import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export default function Login() {
     const { login } = useContext(AuthContext);
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [err, setErr] = useState("");

        const submit = async (e) => {
            e.preventDefault();
            try {
            await login(email, password);
            window.location.href = "/projects";
            } catch {
            setErr("Usuario o contraseña incorrectos");
            }
        };


    return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-semibold text-primary mb-4">Iniciar sesión</h2>
                <form onSubmit={submit} className="flex flex-col gap-3">
                    <label className="text-sm">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="p-2 border rounded" placeholder="email@dominio.com" />
                    <label className="text-sm">Contraseña</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="p-2 border rounded" placeholder="••••••" />
                    {err && <div className="text-red-600 text-sm">{err}</div>}
                    <button className="btn bg-primary text-white py-2 rounded mt-2">Entrar</button>
                </form>
            </div>
        </div>
    )
}