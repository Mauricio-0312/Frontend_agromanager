import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Labores from './pages/Labores'
import Equipos from './pages/Equipos'
import Activities from './pages/Activities'
import Units from './pages/Units'
import Logs from './pages/Logs'
import { AuthContext } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

import PlanesAccionList from './pages/PlanesAccionList'
import PlanAccionForm from './pages/PlanAccionForm'
import CostoHumanoList from './pages/CostoHumanoList'
import CostoHumanoForm from './pages/CostoHumanoForm'
import CostoMaterialList from './pages/CostoMaterialList'
import CostoMaterialForm from './pages/CostoMaterialForm'


function Protected({ children, adminOnly = false }) {
    const { user, loading } = useContext(AuthContext)
    if (loading) return <div className="p-6">Cargando...</div>
    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && user.role !== 'admin') return <Navigate to="/projects" replace />
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
                        <Route path="/admin" element={<Protected adminOnly={true}><AdminPanel /></Protected>} />
                        <Route path="/users" element={<Protected><Users /></Protected>} />
                        <Route path="/users/:id" element={<Protected><UserDetail /></Protected>} />
                        <Route path="/projects" element={<Protected><Projects /></Protected>} />
                        <Route path="/projects/:id" element={<Protected><ProjectDetail /></Protected>} />
                        <Route path="/projects/:id/planes-accion" element={<Protected><PlanesAccionList /></Protected>} />
                        <Route path="/projects/:id/planes-accion/crear" element={<Protected><PlanAccionForm /></Protected>} />
                        <Route path="/planes-accion/:id/editar" element={<Protected><PlanAccionForm /></Protected>} />
                        <Route path="/labores" element={<Protected><Labores /></Protected>} />
                        <Route path="/equipos" element={<Protected><Equipos /></Protected>} />
                        <Route path="/activities" element={<Protected><Activities /></Protected>} />
                        <Route path="/units" element={<Protected><Units /></Protected>} />
                        <Route path="/planes-accion/:id/costos-humanos" element={<Protected><CostoHumanoList /></Protected>} />
                        <Route path="/planes-accion/:id/costos-humanos/crear" element={<Protected><CostoHumanoForm /></Protected>} />
                        <Route path="/costos-humanos/:id" element={<Protected><CostoHumanoForm /></Protected>} />
                        <Route path="/planes-accion/:id/costos-materiales" element={<Protected><CostoMaterialList /></Protected>} />
                        <Route path="/planes-accion/:id/costos-materiales/crear" element={<Protected><CostoMaterialForm /></Protected>} />
                        <Route path="/costos-materiales/:id" element={<Protected><CostoMaterialForm /></Protected>} />
                        <Route path="/logs" element={<Protected adminOnly={true}><Logs /></Protected>} />
                        <Route path="/" element={<Navigate to="/projects" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}