import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente de protección de rutas
 * Redirige a /login si el usuario no está autenticado
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">
                        agriculture
                    </span>
                    <p className="text-[#121811] dark:text-white mt-4 font-semibold">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
