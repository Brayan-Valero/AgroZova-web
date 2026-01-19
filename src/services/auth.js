import { supabase } from './supabase'

/**
 * Iniciar sesión con email y contraseña
 */
export const signIn = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error signing in:', error.message)
        return { data: null, error }
    }
}

/**
 * Registrar nuevo usuario
 */
export const signUp = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error signing up:', error.message)
        return { data: null, error }
    }
}

/**
 * Cerrar sesión
 */
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
    } catch (error) {
        console.error('Error signing out:', error.message)
        return { error }
    }
}

/**
 * Obtener usuario actual
 */
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return { user, error: null }
    } catch (error) {
        console.error('Error getting current user:', error.message)
        return { user: null, error }
    }
}

/**
 * Obtener sesión actual
 */
export const getSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return { session, error: null }
    } catch (error) {
        console.error('Error getting session:', error.message)
        return { session: null, error }
    }
}
