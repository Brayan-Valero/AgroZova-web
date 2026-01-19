import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats } from '../services/stats'
import BottomNavigation from '../components/BottomNavigation'

const Dashboard = () => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        ingresos: 0,
        gastos: 0,
        balance: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [user])

    const loadStats = async () => {
        if (!user) return
        setLoading(true)
        const data = await getDashboardStats(user.id)
        setStats(data)
        setLoading(false)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            {/* TopAppBar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 ios-blur border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="shrink-0">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-primary/20 shadow-sm"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA03o_5743S9U3HrjRhi821bllMOjkzntmhNBtObPAkR-wNQfTj4Nnb0D2YelQbEQt6O0YTRwLzN0MVx8W-8FBTmLXpuuK7Zhm-rjwkICEu15c442PD7b1pnn0pQZpqIM7koCHsmEHsD6ANdgyqw3qaYiMDRMuBPc3VLKgJMwOzMD9oxezS95265GI1p-Gf0Y8Q8COzo4tet4XRUiVAnfSYeXlvAQ32qhixAvMO3ymfWHIDxmuFq74qkm1C9dBa3_EU6krYnA-imMl7")' }}
                            ></div>
                        </div>
                        <div>
                            <p className="text-xs text-[#688961] dark:text-gray-400 font-medium">Panel de Control</p>
                            <h2 className="text-[#121811] dark:text-white text-lg font-bold leading-tight tracking-tight">
                                Hola, {user?.email?.split('@')[0] || 'Usuario'}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSignOut}
                            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 text-[#121811] dark:text-white transition-colors active:scale-95"
                            title="Cerrar sesión"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-md mx-auto w-full pb-24">
                {/* Stats Section */}
                <section className="p-4">
                    <div className="flex flex-col gap-3">
                        {/* Ingresos */}
                        <div className="flex items-center justify-between gap-4 rounded-xl p-5 bg-white dark:bg-white/5 shadow-sm border border-gray-50 dark:border-white/5">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#688961] dark:text-gray-400 text-sm font-medium">Ingresos del mes</p>
                                <p className="text-[#121811] dark:text-white tracking-tight text-2xl font-bold">
                                    {loading ? '...' : formatCurrency(stats.ingresos)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="flex items-center text-[#078821] text-xs font-bold bg-[#078821]/10 px-2 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm mr-1">trending_up</span>+12%
                                </span>
                            </div>
                        </div>

                        {/* Gastos */}
                        <div className="flex items-center justify-between gap-4 rounded-xl p-5 bg-white dark:bg-white/5 shadow-sm border border-gray-50 dark:border-white/5">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#688961] dark:text-gray-400 text-sm font-medium">Gastos del mes</p>
                                <p className="text-[#121811] dark:text-white tracking-tight text-2xl font-bold">
                                    {loading ? '...' : formatCurrency(stats.gastos)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="flex items-center text-[#e72208] text-xs font-bold bg-[#e72208]/10 px-2 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm mr-1">trending_down</span>-5%
                                </span>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="flex items-center justify-between gap-4 rounded-xl p-5 bg-[#FFD700]/10 dark:bg-[#FFD700]/20 border border-[#FFD700]/30 shadow-sm">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#B8860B] dark:text-[#FFD700] text-sm font-bold">Balance Actual</p>
                                <p className="text-[#121811] dark:text-white tracking-tight text-2xl font-extrabold">
                                    {loading ? '...' : formatCurrency(stats.balance)}
                                </p>
                            </div>
                            <div className="bg-[#FFD700] text-white p-2 rounded-lg">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accesos Rápidos (Restaurado Discreto) */}
                <section className="px-4 pb-4">
                    <h3 className="text-[#121811] dark:text-white text-base font-bold mb-3">Accesos Rápidos</h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        <Link to="/pollos" className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="size-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-2xl">flutter_dash</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pollos</span>
                        </Link>
                        <Link to="/gallinas" className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="size-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined text-2xl">egg</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Gallinas</span>
                        </Link>
                        <Link to="/vacas" className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="size-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-2xl">pets</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Vacas</span>
                        </Link>
                        <Link to="/contabilidad" className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div className="size-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Movimientos</span>
                        </Link>
                    </div>
                </section>

            </main>

            {/* BottomNavBar */}
            <BottomNavigation />
        </div>
    )
}

export default Dashboard
