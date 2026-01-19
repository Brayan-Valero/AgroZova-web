import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduccionById, getGastosByProduccion, getIngresosByProduccion, createGasto, createIngreso } from '../services/pollos'
import { formatCurrency, formatDateShort } from '../utils/formatters'
import BottomNavigation from '../components/BottomNavigation'

const PollosDetalle = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [produccion, setProduccion] = useState(null)
    const [gastos, setGastos] = useState([])
    const [ingresos, setIngresos] = useState([])
    const [activeTab, setActiveTab] = useState('resumen')
    const [loading, setLoading] = useState(true)

    // Form states for modals (simplified for now, could be separate components)
    const [showGastoModal, setShowGastoModal] = useState(false)
    const [showVentaModal, setShowVentaModal] = useState(false)

    useEffect(() => {
        loadData()
    }, [id])

    const loadData = async () => {
        setLoading(true)
        const { data: prod } = await getProduccionById(id)
        if (prod) {
            setProduccion(prod)
            const { data: g } = await getGastosByProduccion(id)
            setGastos(g || [])
            const { data: i } = await getIngresosByProduccion(id)
            setIngresos(i || [])
        }
        setLoading(false)
    }

    const totalGastos = gastos.reduce((acc, g) => acc + (g.monto || 0), 0)
    const totalIngresos = ingresos.reduce((acc, i) => acc + (i.monto_total || 0), 0)
    const balance = totalIngresos - totalGastos

    if (loading) return <div className="p-8 text-center">Cargando...</div>
    if (!produccion) return <div className="p-8 text-center">Producción no encontrada</div>

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Header */}
            <header className="bg-white dark:bg-white/5 border-b border-gray-100 dark:border-white/10 p-4 sticky top-0 z-10 safe-top">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/pollos')} className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        arrow_back
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-[#121811] dark:text-white leading-tight">
                            {produccion.nombre}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Iniciado: {formatDateShort(produccion.fecha_inicio)}
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
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Ventas</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(totalIngresos)}</p>
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
                                    <span className="text-gray-500">Galpón</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{produccion.galpon || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Cantidad Inicial</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{produccion.cantidad_inicial} aves</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Cantidad Actual</span>
                                    <span className="font-medium text-[#121811] dark:text-white">{produccion.cantidad_actual} aves</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 dark:border-white/5 pb-2">
                                    <span className="text-gray-500">Mortalidad</span>
                                    <span className="font-medium text-red-500">
                                        {produccion.cantidad_inicial - produccion.cantidad_actual} aves ({((produccion.cantidad_inicial - produccion.cantidad_actual) / produccion.cantidad_inicial * 100).toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500">Estado</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${produccion.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {produccion.estado === 'activo' ? 'En Curso' : 'Finalizada'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gastos' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-[#121811] dark:text-white">Historial de Gastos</h3>
                            {/* In future iteration: Add button to open modal here */}
                        </div>
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
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-[#121811] dark:text-white">Historial de Ventas</h3>
                            {/* In future iteration: Add button to open modal here */}
                        </div>
                        {ingresos.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No hay ventas registradas</div>
                        ) : (
                            ingresos.map(i => (
                                <div key={i.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                            <span className="material-symbols-outlined text-xl">monetization_on</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#121811] dark:text-white">Venta {i.kilos_vendidos}kg</p>
                                            <p className="text-xs text-gray-500">{formatDateShort(i.fecha)} - {formatCurrency(i.precio_por_kilo)}/kg</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#121811] dark:text-white">{formatCurrency(i.monto_total)}</span>
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

export default PollosDetalle
