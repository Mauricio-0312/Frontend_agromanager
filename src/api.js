import axios from 'axios'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'


const client = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
})

// add token if exists
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})


export const api = {
    // auth
    login: (email, password) => client.post('/login', { email, password }),
    // users
    createUser: (payload) => client.post('/signup', payload),
    fetchUsers: () => client.get('/users'),
    getUser: (id) => client.get(`/users/${id}`),
    updateUser: (id, payload) => client.put(`/users/${id}`, payload),
    deleteUser: (id) => client.delete(`/users/${id}`),
    exportUsers: () => client.get('/csv/users', { responseType: 'blob' }),
    changePassword: (id, payload) => client.patch(`/users/${id}/password`, payload),

    // profile
    fetchMe: () => client.get('/me'),

    // projects
    createProject: (payload) => client.post('/projects', payload),
    fetchProjects: (q) => client.get('/projects', { params: { q } }),
    getProject: (id) => client.get(`/projects/${id}`),
    updateProject: (id, payload) => client.put(`/projects/${id}`, payload),
    closeProject: (id) => client.patch(`/projects/${id}/close`),
    exportProjects: () => client.get('/csv/projects', { responseType: 'blob' }),

    // labores agronómicas
    createLabor: (payload) => client.post('/labores', payload),
    fetchLabores: (q) => client.get('/labores', { params: { q } }),
    getLabor: (id) => client.get(`/labores/${id}`),
    updateLabor: (id, payload) => client.put(`/labores/${id}`, payload),
    deleteLabor: (id) => client.delete(`/labores/${id}`),

    // equipos e implementos
    createEquipo: (payload) => client.post('/equipos', payload),
    fetchEquipos: (q) => client.get('/equipos', { params: { q } }),
    getEquipo: (id) => client.get(`/equipos/${id}`),
    updateEquipo: (id, payload) => client.put(`/equipos/${id}`, payload),
    deleteEquipo: (id) => client.delete(`/equipos/${id}`),

    // actividades agrícolas
    createActividad: (payload) => client.post('/activities', payload),
    fetchActividades: (params) => client.get('/activities', { params }),
    getActividad: (id) => client.get(`/activities/${id}`),
    updateActividad: (id, payload) => client.put(`/activities/${id}`, payload),
    deleteActividad: (id) => client.delete(`/activities/${id}`),

    // units of measure
    createUnit: (payload) => client.post('/units', payload),
    fetchUnits: () => client.get('/units'),
    getUnit: (id) => client.get(`/units/${id}`),
    updateUnit: (id, payload) => client.put(`/units/${id}`, payload),
    deleteUnit: (id) => client.delete(`/units/${id}`),

    // logs
    createLog: (payload) => client.post('/logs', payload),
    fetchLogs: (q) => client.get('/logs', { params: { q } }),
    getLog: (id) => client.get(`/logs/${id}`),
    deleteLog: (id) => client.delete(`/logs/${id}`),
    countLogs: () => client.get('/logs/count'),
}


export default api