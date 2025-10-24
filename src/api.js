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
}


export default api