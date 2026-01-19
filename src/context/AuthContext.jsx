import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

// Demo mode check
const isDemoMode = () => {
    const url = import.meta.env.VITE_SUPABASE_URL || ''
    return url.includes('your-project') || url === ''
}

// Demo user
const DEMO_USER = {
    id: 'demo-user-123',
    email: 'demo@agrozova.com',
    user_metadata: {
        full_name: 'Usuario Demo'
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if we're in demo mode
        if (isDemoMode()) {
            // Check localStorage for demo session
            const demoSession = localStorage.getItem('demoSession')
            if (demoSession) {
                setUser(DEMO_USER)
            }
            setLoading(false)
        } else {
            // Real Supabase auth - only import when not in demo mode
            import('../services/auth').then(({ getCurrentUser }) => {
                getCurrentUser().then((result) => {
                    setUser(result.user)
                    setLoading(false)
                })
            })
        }
    }, [])

    const demoSignIn = (email, password) => {
        if (email === 'demo@agrozova.com' && password === 'demo123') {
            setUser(DEMO_USER)
            localStorage.setItem('demoSession', 'true')
            return { data: { user: DEMO_USER }, error: null }
        }
        return { data: null, error: { message: 'Credenciales incorrectas. Usa: demo@agrozova.com / demo123' } }
    }

    const demoSignOut = () => {
        setUser(null)
        localStorage.removeItem('demoSession')
    }

    const value = {
        user,
        loading,
        demoMode: isDemoMode(),
        demoSignIn,
        demoSignOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
