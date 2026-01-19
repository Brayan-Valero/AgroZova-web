import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVacaById, getGastosByVaca, getProduccionLecheByVaca } from '../services/vacas'
import { formatCurrency, formatDateShort } from '../utils/formatters'
import BottomNavigation from '../components/BottomNavigation'

const VacasDetalle = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vaca, setVaca] = useState(null)
    const [gastos, setGastos] = useState([])
    const [produccion, setProduccion] = useState([])
    const [activeTab, setActiveTab] = useState('resumen')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id])

    const loadData = async () => {
        setLoading(true)
        const { data: v } = await getVacaById(id)
        if (v) {
            setVaca(v)
            const { data: g } = await getGastosByVaca(id)
            setGastos(g || [])
            const { data: p } = await getProduccionLecheByVaca(id)
            setProduccion(p || [])
        }
        setLoading(false)
    }

    const totalGastos = gastos.reduce((acc, g) => acc + (g.monto || 0), 0)
    const totalLeche = produccion.reduce((acc, p) => acc + (p.litros || 0), 0)
    const totalVentas = produccion.reduce((acc, p) => acc + (p.monto_total || 0), 0)
    const balance = totalVentas - totalGastos

    if (loading) return <div className="p-8 text-center">Cargando...</div>
    if (!vaca) return <div className="p-8 text-center">Vaca no encontrada</div>

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/10 p-4 sticky top-0 z-10 safe-top">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/vacas')} className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        arrow_back
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#121811] dark:text-white leading-tight">
                            {vaca.nombre}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Código: {vaca.codigo || 'N/A'}
                        </p>
                    </div>
                </div>
            </header>

            {/* Quick Stats Header */}
            <div className="bg-white dark:bg-white/5 p-4 border-b border-gray-100 dark:border-white/10 grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/10">
                <div className="px-2 text-center">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Gastos</p>
                    <p className="text-sm font-bold text-red-500">{formatCurrency(totalGastos)}</p>
                </div>
                <div className="px-2 text-center">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Ventas Leche</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(totalVentas)}</p>
                </div>
                <div className="px-2 text-center">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Balance</p>
                    <p className={`text-sm font-bold ${balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5">
                <button
                    onClick={() => setActiveTab('resumen')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resumen' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
                >
                    Resumen
                </button>
                <button
                    onClick={() => setActiveTab('gastos')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gastos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
                >
                    Gastos
                </button>
                <button
                    onClick={() => setActiveTab('ventas')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ventas' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
                >
                    Producción
                </button>
            </div>

            {/* Content */}
            <main className="flex-1 p-4 pb-24 overflow-y-auto">
                {activeTab === 'resumen' && (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5">
                            <h3 className="font-bold text-[#121811] dark:text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Información General
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Estado</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700`}>
                                        {vaca.estado}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Fecha Nacimiento</span>
                                    <span className="font-medium text-[#121811] dark:text-white">
                                        {vaca.fecha_nacimiento ? formatDateShort(vaca.fecha_nacimiento) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Total Leche Producida</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{totalLeche} L</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Notas</span>
                                </div>
                                <p className="text-xs text-gray-600 bg-gray-50 dark:bg-white/5 p-2 rounded-lg">
                                    {vaca.notas || 'Sin notas adicionales.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gastos' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-[#121811] dark:text-white">Historial de Gastos</h3>
                        {gastos.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No hay gastos registrados</div>
                        ) : (
                            gastos.map(g => (
                                <div key={g.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                            <span className="material-symbols-outlined text-xl">payments</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#121811] dark:text-white">{g.concepto}</p>
                                            <p className="text-xs text-gray-500">{formatDateShort(g.fecha)} - {g.categoria}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#121811] dark:text-white">{formatCurrency(g.monto)}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'ventas' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-[#121811] dark:text-white">Historial de Producción</h3>
                        {produccion.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No hay registros de producción</div>
                        ) : (
                            produccion.map(p => (
                                <div key={p.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined text-xl">water_drop</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#121811] dark:text-white">{p.litros} Litros</p>
                                            <p className="text-xs text-gray-500">{formatDateShort(p.fecha)} - {formatCurrency(p.precio_por_litro)}/L</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#121811] dark:text-white">{formatCurrency(p.monto_total)}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <BottomNavigation />
        </div>
    )
}

export default VacasDetalle
