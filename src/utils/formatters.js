/**
 * Formatear número como moneda colombiana (COP)
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value || 0)
}

/**
 * Formatear fecha en formato local colombiano
 */
export const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Formatear fecha en formato corto
 */
export const formatDateShort = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

/**
 * Obtener fecha en formato ISO para inputs
 */
export const getISODate = (date = new Date()) => {
    return date.toISOString().split('T')[0]
}

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value || 0)
}

/**
 * Calcular porcentaje
 */
export const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0
    return ((part / total) * 100).toFixed(2)
}
