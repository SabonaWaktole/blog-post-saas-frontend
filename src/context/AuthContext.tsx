import { createContext, useContext, useState, ReactNode } from 'react'
import { apiClient } from '../api/client'

interface User {
    id: number
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (credentials: any) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)

    const isAuthenticated = !!user

    const login = async (credentials: any) => {
        try {
            // Assuming endpoint /auth/login returns { user, token }
            // For now, documentation says POST /auth/login returns { token, user }
            const response = await apiClient.post<{ user: User, token: string }>('/auth/login', credentials)

            // Store token in localStorage if needed (apiClient might need to be updated to use it)
            // For this refactor, we focus on the call itself.
            localStorage.setItem('token', response.token) // Basic token storage
            setUser(response.user)
        } catch (error) {
            console.error('Login failed:', error)
            throw error;
        }
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
