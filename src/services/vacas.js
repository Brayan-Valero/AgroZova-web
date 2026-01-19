import { supabase } from './supabase'
// import { isDemo, demoService } from './demoStore'

/**
 * Obtener inventario de vacas del usuario
 */
export const getVacas = async (userId) => {
    // if (isDemo()) return demoService.getAll('inventario_vacas', userId)

    try {
        const { data, error } = await supabase
            .from('inventario_vacas')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        return { data: null, error }
    }
}

/**
 * Obtener una vaca por ID
 */
export const getVacaById = async (id) => {
    // if (isDemo()) return demoService.getById('inventario_vacas', id)

    try {
        const { data, error } = await supabase
            .from('inventario_vacas')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching vaca:', error)
        return { data: null, error }
    }
}

/**
 * Obtener producción de leche de una vaca
 */
export const getProduccionLecheByVaca = async (vacaId) => {
    // if (isDemo()) return demoService.getByForeignKey('produccion_leche', 'vaca_id', vacaId)

    try {
        const { data, error } = await supabase
            .from('produccion_leche')
            .select('*')
            .eq('vaca_id', vacaId)
            .order('fecha', { ascending: false })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching produccion leche:', error)
        return { data: null, error }
    }
}

/**
 * Crear nueva vaca en inventario
 */
export const createVaca = async (vacaData) => {
    // if (isDemo()) return demoService.create('inventario_vacas', vacaData)

    try {
        const { data, error } = await supabase
            .from('inventario_vacas')
            .insert([vacaData])
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error creating vaca:', error)
        return { data: null, error }
    }
}

/**
 * Actualizar información de vaca
 */
export const updateVaca = async (id, updates) => {
    // if (isDemo()) return demoService.update('inventario_vacas', id, updates)

    try {
        const { data, error } = await supabase
            .from('inventario_vacas')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error updating vaca:', error)
        return { data: null, error }
    }
}

/**
 * Eliminar vaca del inventario
 */
export const deleteVaca = async (id) => {
    // if (isDemo()) return demoService.delete('inventario_vacas', id)

    try {
        const { error } = await supabase
            .from('inventario_vacas')
            .delete()
            .eq('id', id)

        if (error) throw error
        return { error: null }
    } catch (error) {
        console.error('Error deleting vaca:', error)
        return { error }
    }
}

/**
 * Obtener gastos de una vaca
 */
export const getGastosByVaca = async (vacaId) => {
    // if (isDemo()) return demoService.getByForeignKey('gastos_vacas', 'vaca_id', vacaId)

    try {
        const { data, error } = await supabase
            .from('gastos_vacas')
            .select('*')
            .eq('vaca_id', vacaId)
            .order('fecha', { ascending: false })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching gastos:', error)
        return { data: null, error }
    }
}

/**
 * Crear gasto para una vaca
 */
export const createGasto = async (gastoData) => {
    // if (isDemo()) return demoService.create('gastos_vacas', gastoData)

    try {
        const { data, error } = await supabase
            .from('gastos_vacas')
            .insert([gastoData])
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error creating gasto:', error)
        return { data: null, error }
    }
}

/**
 * Obtener producción de leche de una vaca
 */
export const getProduccionByVaca = async (vacaId) => {
    // if (isDemo()) return demoService.getByForeignKey('produccion_leche', 'vaca_id', vacaId)

    try {
        const { data, error } = await supabase
            .from('produccion_leche')
            .select('*')
            .eq('vaca_id', vacaId)
            .order('fecha', { ascending: false })

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching produccion:', error)
        return { data: null, error }
    }
}

/**
 * Registrar producción de leche
 */
export const createProduccion = async (produccionData) => {
    // if (isDemo()) return demoService.create('produccion_leche', produccionData)

    try {
        const { data, error } = await supabase
            .from('produccion_leche')
            .insert([produccionData])
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error creating produccion:', error)
        return { data: null, error }
    }
}

/**
 * Calcular rentabilidad de una vaca
 */
export const calcularRentabilidad = async (vacaId) => {
    try {
        const { data: gastos } = await getGastosByVaca(vacaId)
        const { data: produccion } = await getProduccionByVaca(vacaId)

        const totalGastos = gastos?.reduce((acc, g) => acc + (g.monto || 0), 0) || 0
        const totalIngresos = produccion?.reduce((acc, p) => acc + (p.monto_total || 0), 0) || 0
        const rentabilidad = totalIngresos - totalGastos
        const porcentaje = totalGastos > 0 ? ((rentabilidad / totalGastos) * 100) : 0

        return {
            totalGastos,
            totalIngresos,
            rentabilidad,
            porcentaje
        }
    } catch (error) {
        console.error('Error calculating rentabilidad:', error)
        return null
    }
}
