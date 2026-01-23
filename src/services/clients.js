import { supabase } from './supabase'

/**
 * Obtener todos los clientes únicos registrados en las ventas de todos los módulos
 */
export const getAllRecentClients = async (userId) => {
    try {
        // Consultar de las 3 tablas de ingresos/ventas
        const [
            resPollos,
            resGallinas,
            resVacas
        ] = await Promise.allSettled([
            supabase.from('ingresos_pollos').select('cliente').eq('user_id', userId).not('cliente', 'is', null),
            supabase.from('ventas_gallinas').select('cliente').eq('user_id', userId).not('cliente', 'is', null),
            supabase.from('produccion_leche').select('cliente').eq('user_id', userId).not('cliente', 'is', null)
        ])

        const clientsPollos = resPollos.status === 'fulfilled' && !resPollos.value.error ? resPollos.value.data : []
        const clientsGallinas = resGallinas.status === 'fulfilled' && !resGallinas.value.error ? resGallinas.value.data : []
        const clientsVacas = resVacas.status === 'fulfilled' && !resVacas.value.error ? resVacas.value.data : []

        const allClients = [
            ...(clientsPollos?.map(i => i.cliente) || []),
            ...(clientsGallinas?.map(v => v.cliente) || []),
            ...(clientsVacas?.map(p => p.cliente) || [])
        ]

        const uniqueClients = [...new Set(allClients)]
            .filter(name => name && name !== 'Consumidor Final')
            .sort()
            .slice(0, 20) // Top 20

        return { data: uniqueClients, error: null }
    } catch (error) {
        console.error('Error fetching all clients:', error)
        return { data: [], error }
    }
}
