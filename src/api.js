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
    login: (email, password) => client.post('/login', { email, password }),
    createUser: (payload) => client.post('/signup', payload),
    fetchUsers: () => client.get('/admin/users'),
}


export default api