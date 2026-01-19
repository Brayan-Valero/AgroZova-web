import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, signIn, signOut } from '../services/auth'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Observers auth state changes
        const checkUser = async () => {
            const { user } = await getCurrentUser()
            setUser(user)
            setLoading(false)
        }

        checkUser()
    }, [])

    const handleSignIn = async (email, password) => {
        const result = await signIn(email, password)
        if (result.data?.user) {
            setUser(result.data.user)
        }
        return result
    }

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
    }

    const value = {
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut
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
