import React, { createContext, useState, useEffect } from 'react'
import { api } from '../api'


export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function load() {
            const token = localStorage.getItem('token')
            if (!token) { setLoading(false); return }
            try {
                const res = await api.fetchMe()
                setUser(res.data)
            } catch (err) {
                console.error('fetchMe err', err)
                localStorage.removeItem('token')
            }
            setLoading(false)
        }
        load()
    }, [])


    const login = async (email, password) => {
        const res = await api.login(email, password)
        if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token)
            if (res.data.role) localStorage.setItem('role', res.data.role)
            const me = await api.fetchMe()
            setUser(me.data)
        }
        return res
    }


    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}