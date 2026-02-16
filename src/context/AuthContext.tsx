import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../api/client'

interface User {
    id: string
    userId?: string // Backend might return one or the other, handling both
    email: string
    role: string
}

interface AuthResponse {
    user: User
    tokens: {
        accessToken: string
        refreshToken: string
    }
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: any) => Promise<void>
    register: (credentials: any) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing session on mount
    useEffect(() => {
        const restoreSession = async () => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                try {
                    const response = await apiClient.get<{ user: User }>('/auth/me')
                    // Normalize user ID if needed (backend returns 'userId' in /me, but 'id' in login)
                    const normalizedUser = {
                        ...response.user,
                        id: response.user.id || response.user.userId || ''
                    }
                    setUser(normalizedUser)
                } catch (error) {
                    console.error('Failed to restore session:', error)
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                }
            }
            setIsLoading(false)
        }
        restoreSession()
    }, [])

    const login = async (credentials: any) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
            localStorage.setItem('accessToken', response.tokens.accessToken)
            localStorage.setItem('refreshToken', response.tokens.refreshToken)
            setUser(response.user)
        } catch (error) {
            console.error('Login failed:', error)
            throw error;
        }
    }

    const register = async (credentials: any) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
            localStorage.setItem('accessToken', response.tokens.accessToken)
            localStorage.setItem('refreshToken', response.tokens.refreshToken)
            setUser(response.user)
        } catch (error) {
            console.error('Registration failed:', error)
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setUser(null)
        window.location.href = '/login'
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout
        }}>
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
