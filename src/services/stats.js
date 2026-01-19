import { supabase } from './supabase'
// import { isDemo, demoService } from './demoStore'

export const getDashboardStats = async (userId) => {
    /* if (isDemo()) {
        const { data: ingresosPollos } = await demoService.getAll('ingresos_pollos', userId)
        const { data: ventasGallinas } = await demoService.getAll('ventas_gallinas', userId)
        const { data: produccionLeche } = await demoService.getAll('produccion_leche', userId)

        const { data: gastosPollos } = await demoService.getAll('gastos_pollos', userId)
        const { data: gastosGallinas } = await demoService.getAll('gastos_gallinas', userId)
        const { data: gastosVacas } = await demoService.getAll('gastos_vacas', userId)

        const totalIngresos =
            (ingresosPollos?.reduce((acc, i) => acc + (i.monto_total || 0), 0) || 0) +
            (ventasGallinas?.reduce((acc, v) => acc + (v.monto_total || 0), 0) || 0) +
            (produccionLeche?.reduce((acc, p) => acc + (p.monto_total || 0), 0) || 0)

        const totalGastos =
            (gastosPollos?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0) +
            (gastosGallinas?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0) +
            (gastosVacas?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0)

        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos
        }
    } */

    try {
        const { data: ingresosPollos } = await supabase.from('ingresos_pollos').select('monto_total')
        const { data: ventasGallinas } = await supabase.from('ventas_gallinas').select('monto_total')
        const { data: produccionLeche } = await supabase.from('produccion_leche').select('monto_total')

        const { data: gastosPollos } = await supabase.from('gastos_pollos').select('monto')
        const { data: gastosGallinas } = await supabase.from('gastos_gallinas').select('monto')
        const { data: gastosVacas } = await supabase.from('gastos_vacas').select('monto')

        const totalIngresos =
            (ingresosPollos?.reduce((acc, i) => acc + (i.monto_total || 0), 0) || 0) +
            (ventasGallinas?.reduce((acc, v) => acc + (v.monto_total || 0), 0) || 0) +
            (produccionLeche?.reduce((acc, p) => acc + (p.monto_total || 0), 0) || 0)

        const totalGastos =
            (gastosPollos?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0) +
            (gastosGallinas?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0) +
            (gastosVacas?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0)

        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return { ingresos: 0, gastos: 0, balance: 0 }
    }
}

export const getFinancialMovements = async (userId, startDate, endDate = null) => {
    try {
        let ingresosPollosQuery = supabase.from('ingresos_pollos').select('monto_total, fecha').gte('fecha', startDate)
        let ventasGallinasQuery = supabase.from('ventas_gallinas').select('monto_total, fecha').gte('fecha', startDate)
        let produccionLecheQuery = supabase.from('produccion_leche').select('monto_total, fecha').gte('fecha', startDate)
        let gastosPollosQuery = supabase.from('gastos_pollos').select('*').gte('fecha', startDate)
        let gastosGallinasQuery = supabase.from('gastos_gallinas').select('*').gte('fecha', startDate)
        let gastosVacasQuery = supabase.from('gastos_vacas').select('*').gte('fecha', startDate)

        if (endDate) {
            ingresosPollosQuery = ingresosPollosQuery.lte('fecha', endDate)
            ventasGallinasQuery = ventasGallinasQuery.lte('fecha', endDate)
            produccionLecheQuery = produccionLecheQuery.lte('fecha', endDate)
            gastosPollosQuery = gastosPollosQuery.lte('fecha', endDate)
            gastosGallinasQuery = gastosGallinasQuery.lte('fecha', endDate)
            gastosVacasQuery = gastosVacasQuery.lte('fecha', endDate)
        }

        const [
            { data: ingresosPollos },
            { data: ventasGallinas },
            { data: produccionLeche },
            { data: gastosPollos },
            { data: gastosGallinas },
            { data: gastosVacas }
        ] = await Promise.all([
            ingresosPollosQuery,
            ventasGallinasQuery,
            produccionLecheQuery,
            gastosPollosQuery,
            gastosGallinasQuery,
            gastosVacasQuery
        ])

        const todosMovimientos = [
            ...(ingresosPollos?.map(i => ({ tipo: 'ingreso', concepto: 'Venta de Pollos', monto: i.monto_total, fecha: i.fecha, modulo: 'Pollos' })) || []),
            ...(ventasGallinas?.map(v => ({ tipo: 'ingreso', concepto: 'Venta de Huevos', monto: v.monto_total, fecha: v.fecha, modulo: 'Gallinas' })) || []),
            ...(produccionLeche?.map(p => ({ tipo: 'ingreso', concepto: 'Venta de Leche', monto: p.monto_total, fecha: p.fecha, modulo: 'Vacas' })) || []),
            ...(gastosPollos?.map(g => ({ tipo: 'gasto', concepto: g.concepto, monto: g.monto, fecha: g.fecha, modulo: 'Pollos', categoria: g.categoria })) || []),
            ...(gastosGallinas?.map(g => ({ tipo: 'gasto', concepto: g.concepto, monto: g.monto, fecha: g.fecha, modulo: 'Gallinas', categoria: g.categoria })) || []),
            ...(gastosVacas?.map(g => ({ tipo: 'gasto', concepto: g.concepto, monto: g.monto, fecha: g.fecha, modulo: 'Vacas', categoria: g.categoria })) || [])
        ]

        todosMovimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        return todosMovimientos
    } catch (error) {
        console.error('Error fetching financial movements:', error)
        return []
    }
}

export const getInventoryStats = async (userId) => {
    /* if (isDemo()) {
        const { data: pollos } = await demoService.getAll('producciones_pollos', userId)
        const { data: gallinas } = await demoService.getAll('lotes_gallinas', userId)
        const { data: vacas } = await demoService.getAll('inventario_vacas', userId)

        return {
            totalPollos: pollos?.filter(p => p.estado === 'activo').reduce((acc, curr) => acc + Number(curr.cantidad_actual || 0), 0) || 0,
            totalGallinas: gallinas?.reduce((acc, curr) => acc + Number(curr.poblacion_actual || 0), 0) || 0,
            totalVacas: vacas?.length || 0
        }
    } */

    try {
        const { data: pollos } = await supabase.from('producciones_pollos').select('cantidad_actual').eq('user_id', userId).eq('estado', 'activo')
        const totalPollos = pollos?.reduce((acc, curr) => acc + (curr.cantidad_actual || 0), 0) || 0

        const { data: gallinas } = await supabase.from('lotes_gallinas').select('poblacion_actual').eq('user_id', userId)
        const totalGallinas = gallinas?.reduce((acc, curr) => acc + (curr.poblacion_actual || 0), 0) || 0

        const { count: totalVacas } = await supabase.from('inventario_vacas').select('*', { count: 'exact', head: true }).eq('user_id', userId)

        return {
            totalPollos,
            totalGallinas,
            totalVacas: totalVacas || 0
        }
    } catch (error) {
        console.error('Error inventory stats:', error)
        return { totalPollos: 0, totalGallinas: 0, totalVacas: 0 }
    }
}

export const getProductionHistory = async (userId, days = 30) => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    try {
        // Huevos
        const { data: huevos } = await supabase
            .from('ventas_gallinas')
            .select('fecha, cantidad')
            .eq('unidad_medida', 'unidad') // Asumiendo que graficamos unidades individuales o cartones, normalizar si es necesario
            .gte('fecha', startDateStr)
            .order('fecha', { ascending: true })

        // Leche
        const { data: leche } = await supabase
            .from('produccion_leche')
            .select('fecha, litros')
            .gte('fecha', startDateStr)
            .order('fecha', { ascending: true })

        // Agrupar por fecha
        const historyMap = {}

        // Llenar con fechas vacías para continuidad
        for (let i = 0; i <= days; i++) {
            const d = new Date(startDate)
            d.setDate(startDate.getDate() + i)
            const dateStr = d.toISOString().split('T')[0]
            // Formato corto para gráfica DD/MM
            const shortDate = `${d.getDate()}/${d.getMonth() + 1}`

            historyMap[dateStr] = {
                fecha: dateStr,
                shortDate,
                huevos: 0,
                leche: 0
            }
        }

        huevos?.forEach(h => {
            if (historyMap[h.fecha]) {
                historyMap[h.fecha].huevos += Number(h.cantidad)
            }
        })

        leche?.forEach(l => {
            if (historyMap[l.fecha]) {
                historyMap[l.fecha].leche += Number(l.litros)
            }
        })

        return Object.values(historyMap).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    } catch (error) {
        console.error('Error fetching history:', error)
        return []
    }
}

export const getFinancialHistory = async (userId, days = 30) => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    try {
        // Fetch all financial data in one go (could be optimized but fine for now)
        const [
            { data: ingresosPollos },
            { data: ventasGallinas },
            { data: produccionLeche },
            { data: gastosPollos },
            { data: gastosGallinas },
            { data: gastosVacas }
        ] = await Promise.all([
            supabase.from('ingresos_pollos').select('monto_total, fecha').gte('fecha', startDateStr),
            supabase.from('ventas_gallinas').select('monto_total, fecha').gte('fecha', startDateStr),
            supabase.from('produccion_leche').select('monto_total, fecha').gte('fecha', startDateStr),
            supabase.from('gastos_pollos').select('monto, fecha').gte('fecha', startDateStr),
            supabase.from('gastos_gallinas').select('monto, fecha').gte('fecha', startDateStr),
            supabase.from('gastos_vacas').select('monto, fecha').gte('fecha', startDateStr)
        ])

        const historyMap = {}

        // Initialize dates
        for (let i = 0; i <= days; i++) {
            const d = new Date(startDate)
            d.setDate(startDate.getDate() + i)
            const dateStr = d.toISOString().split('T')[0]
            const shortDate = `${d.getDate()}/${d.getMonth() + 1}`

            historyMap[dateStr] = {
                fecha: dateStr,
                shortDate,
                ingresos: 0,
                gastos: 0
            }
        }

        // Helper to aggregate
        const aggregate = (items, key, field) => {
            items?.forEach(item => {
                if (historyMap[item.fecha]) {
                    historyMap[item.fecha][key] += Number(item[field] || 0)
                }
            })
        }

        aggregate(ingresosPollos, 'ingresos', 'monto_total')
        aggregate(ventasGallinas, 'ingresos', 'monto_total')
        aggregate(produccionLeche, 'ingresos', 'monto_total')

        aggregate(gastosPollos, 'gastos', 'monto')
        aggregate(gastosGallinas, 'gastos', 'monto')
        aggregate(gastosVacas, 'gastos', 'monto')

        return Object.values(historyMap).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    } catch (error) {
        console.error('Error fetching financial history:', error)
        return []
    }
}
