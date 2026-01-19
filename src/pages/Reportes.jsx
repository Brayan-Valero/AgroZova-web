import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInventoryStats } from '../services/stats'
import { formatCurrency } from '../utils/formatters'
import BottomNavigation from '../components/BottomNavigation'

const Reportes = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalPollos: 0,
        totalGallinas: 0,
        totalVacas: 0,
        produccionLeche: 0,
        produccionHuevos: 0
    })

    useEffect(() => {
        loadReportes()
    }, [user])

    const loadReportes = async () => {
        if (!user) return
        setLoading(true)

        try {
            const inventory = await getInventoryStats(user.id)
            setStats({
                ...inventory,
                produccionLeche: 0, // Placeholder
                produccionHuevos: 0 // Placeholder
            })

        } catch (error) {
            console.error('Error loading reports:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#121811] dark:text-white">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden max-w-[430px] mx-auto bg-white dark:bg-[#0a1108] shadow-2xl">
                {/* TopAppBar */}
                <div className="flex items-center bg-white dark:bg-[#0a1108] p-4 pb-2 justify-between sticky top-0 z-50 border-b border-[#dde6db] dark:border-[#2a3528]">
                    <Link to="/" className="text-[#121811] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
                    </Link>
                    <div className="flex flex-col items-center">
                        <h2 className="text-[#121811] dark:text-white text-lg font-bold leading-tight">Reportes</h2>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#688961]">Métricas de Producción</span>
                    </div>
                    <div className="flex w-12 items-center justify-end"></div>
                </div>

                <div className="p-4 space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-[#688961]">Cargando métricas...</p>
                        </div>
                    ) : (
                        <>
                            {/* Resumen de Inventario */}
                            <section className="space-y-3">
                                <h3 className="font-bold text-lg text-[#121811] dark:text-white">Inventario Actual</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#f1f4f0] dark:bg-[#1a2618] p-4 rounded-xl border border-[#dde6db] dark:border-[#2a3528]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-primary">flutter_dash</span>
                                            <span className="text-xs font-bold uppercase text-[#688961]">Pollos</span>
                                        </div>
                                        <p className="text-2xl font-black text-[#121811] dark:text-white">{stats.totalPollos}</p>
                                        <p className="text-xs text-[#688961]">Cabezas</p>
                                    </div>

                                    <div className="bg-[#f1f4f0] dark:bg-[#1a2618] p-4 rounded-xl border border-[#dde6db] dark:border-[#2a3528]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="material-symbols-outlined text-primary">egg</span>
                                            <span className="text-xs font-bold uppercase text-[#688961]">Gallinas</span>
                                        </div>
                                        <p className="text-2xl font-black text-[#121811] dark:text-white">{stats.totalGallinas}</p>
                                        <p className="text-xs text-[#688961]">Aves Ponedoras</p>
                                    </div>

                                    <div className="bg-[#f1f4f0] dark:bg-[#1a2618] p-4 rounded-xl border border-[#dde6db] dark:border-[#2a3528] col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-symbols-outlined text-primary">pets</span>
                                                    <span className="text-xs font-bold uppercase text-[#688961]">Ganado Bovino</span>
                                                </div>
                                                <p className="text-2xl font-black text-[#121811] dark:text-white">{stats.totalVacas}</p>
                                                <p className="text-xs text-[#688961]">Cabezas totales</p>
                                            </div>
                                            <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-3xl text-primary">grass</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Próximamente: Gráficas */}
                            <section className="pt-6 border-t border-[#dde6db] dark:border-[#2a3528]">
                                <h3 className="font-bold text-lg text-[#121811] dark:text-white mb-3">Tendencias (Demo)</h3>
                                <div className="bg-white dark:bg-[#1a2618] p-6 rounded-xl border border-dashed border-[#688961] flex flex-col items-center justify-center text-center">
                                    <span className="material-symbols-outlined text-4xl text-[#688961] mb-2">bar_chart</span>
                                    <p className="text-[#121811] dark:text-white font-medium">Gráficas de Producción</p>
                                    <p className="text-sm text-[#688961] mt-1">Próximamente visualizarás aquí la curva de producción de huevos y leche.</p>
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Bottom safe area */}
                <div className="h-8 bg-white dark:bg-[#0a1108]"></div>

                <BottomNavigation />
            </div>
        </div>
    )
}

export default Reportes
