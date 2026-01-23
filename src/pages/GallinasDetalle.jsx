import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLoteById, getGastosByLote, getVentasByLote, updateVenta } from '../services/gallinas'
import { formatCurrency, formatDateShort } from '../utils/formatters'
import BottomNavigation from '../components/BottomNavigation'

const GallinasDetalle = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lote, setLote] = useState(null)
    const [gastos, setGastos] = useState([])
    const [ventas, setVentas] = useState([])
    const [activeTab, setActiveTab] = useState('resumen')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id])

    const loadData = async () => {
        setLoading(true)
        const { data: l } = await getLoteById(id)
        if (l) {
            setLote(l)
            const { data: g } = await getGastosByLote(id)
            setGastos(g || [])
            const { data: v } = await getVentasByLote(id)
            setVentas(v || [])
        }
        setLoading(false)
    }

    const handleMarkAsPaid = async (ventaId) => {
        const { error } = await updateVenta(ventaId, { estado_pago: 'pagado' })
        if (!error) {
            loadData()
        }
    }

    if (loading) return <div className="p-8 text-center">Cargando...</div>
    if (!lote) return <div className="p-8 text-center">Lote no encontrado</div>

    const totalGastos = gastos.reduce((acc, g) => acc + (g.monto || 0), 0)
    const totalVentas = ventas.reduce((acc, v) => acc + (v.monto_total || 0), 0)
    const totalPorCobrar = ventas.filter(v => v.estado_pago === 'debe').reduce((acc, v) => acc + (v.monto_total || 0), 0)
    const balance = (totalVentas - totalPorCobrar) - totalGastos

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/10 p-4 sticky top-0 z-10 safe-top">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/gallinas')} className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        arrow_back
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#121811] dark:text-white leading-tight">
                            {lote.nombre}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Raza: {lote.raza}
                        </p>
                    </div>
                </div>
            </header>

            {/* Quick Stats Header */}
            <div className="bg-white dark:bg-white/5 p-4 border-b border-gray-100 dark:border-white/10 grid grid-cols-4 divide-x divide-gray-100 dark:divide-white/10">
                <div className="px-1 text-center">
                    <p className="text-[9px] uppercase text-gray-500 font-bold">Gastos</p>
                    <p className="text-xs font-bold text-red-500">{formatCurrency(totalGastos)}</p>
                </div>
                <div className="px-1 text-center">
                    <p className="text-[9px] uppercase text-gray-500 font-bold">Ventas</p>
                    <p className="text-xs font-bold text-green-600">{formatCurrency(totalVentas)}</p>
                </div>
                <div className="px-1 text-center">
                    <p className="text-[9px] uppercase text-gray-500 font-bold">Por Cobrar</p>
                    <p className="text-xs font-bold text-orange-500">{formatCurrency(totalPorCobrar)}</p>
                </div>
                <div className="px-1 text-center">
                    <p className="text-[9px] uppercase text-gray-500 font-bold">Balance</p>
                    <p className={`text-xs font-bold ${balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
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
                    Ventas
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
                                    <span className="text-gray-500">Iniciado</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{formatDateShort(lote.fecha_inicio)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Población Inicial</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{lote.poblacion_inicial} aves</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Población Actual</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{lote.poblacion_actual} aves</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Edad (aprox)</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{lote.edad_semanas} semanas</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Producción Actual</span>
                                    <span className="font-medium text-green-600">{lote.porcentaje_produccion || 0}%</span>
                                </div>
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
                        <h3 className="font-bold text-[#121811] dark:text-white">Historial de Ventas</h3>
                        {ventas.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No hay ventas registradas</div>
                        ) : (
                            ventas.map(v => (
                                <div key={v.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                            <span className="material-symbols-outlined text-xl">egg</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-[#121811] dark:text-white">{v.cantidad} {v.unidad_medida}</p>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${v.estado_pago === 'debe' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {v.estado_pago || 'Pagado'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#688961] uppercase font-bold">{formatDateShort(v.fecha)}</p>
                                            {v.estado_pago === 'debe' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(v.id)}
                                                    className="mt-1 text-[9px] font-bold text-primary underline underline-offset-2 flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                                    Marcar pagado
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#121811] dark:text-white">{formatCurrency(v.monto_total)}</span>
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

export default GallinasDetalle
