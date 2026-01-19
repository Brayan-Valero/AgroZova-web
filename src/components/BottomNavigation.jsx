import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BottomNavigation = () => {
    const { pathname } = useLocation()
    const { signOut } = useAuth()

    const isActive = (path) => pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/10 pb-6 pt-3 z-50">
            <div className="max-w-md mx-auto flex gap-2 px-4">
                <Link
                    to="/"
                    className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-[#688961] dark:text-gray-400 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined">home</span>
                    <p className="text-[10px] font-bold leading-normal tracking-tight">Inicio</p>
                </Link>
                <Link
                    to="/reportes"
                    className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${isActive('/reportes') ? 'text-primary' : 'text-[#688961] dark:text-gray-400 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined">bar_chart</span>
                    <p className="text-[10px] font-medium leading-normal tracking-tight">Reportes</p>
                </Link>
                <Link
                    to="/contabilidad"
                    className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${isActive('/contabilidad') ? 'text-primary' : 'text-[#688961] dark:text-gray-400 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined">calculate</span>
                    <p className="text-[10px] font-medium leading-normal tracking-tight">Contabilidad</p>
                </Link>
                <Link
                    to="/perfil"
                    className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${isActive('/perfil') ? 'text-primary' : 'text-[#688961] dark:text-gray-400 hover:text-primary'}`}
                >
                    <span className="material-symbols-outlined">person</span>
                    <p className="text-[10px] font-medium leading-normal tracking-tight">Perfil</p>
                </Link>
            </div>
        </nav>
    )
}

export default BottomNavigation
