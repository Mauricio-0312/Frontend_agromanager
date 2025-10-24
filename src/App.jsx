import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import { AuthContext } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'


function Protected({ children, adminOnly = false }) {
    const { user, loading } = useContext(AuthContext)
    if (loading) return <div className="p-6">Cargando...</div>
    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
    return children
}


export default function App() {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="main">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                        <Route path="/admin" element={<Protected adminOnly={true}><AdminPanel /></Protected>} />
                        <Route path="/users" element={<Protected><Users /></Protected>} />
                        <Route path="/users/:id" element={<Protected><UserDetail /></Protected>} />
                        <Route path="/projects" element={<Protected><Projects /></Protected>} />
                        <Route path="/projects/:id" element={<Protected><ProjectDetail /></Protected>} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}