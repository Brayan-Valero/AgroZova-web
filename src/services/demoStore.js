// Utility for Demo Mode persistence using LocalStorage

export const isDemo = () => {
    const url = import.meta.env.VITE_SUPABASE_URL || ''
    return url.includes('your-project') || url === ''
}

const getStore = (table) => {
    const data = localStorage.getItem(`demo_${table}`)
    return data ? JSON.parse(data) : []
}

const setStore = (table, data) => {
    localStorage.setItem(`demo_${table}`, JSON.stringify(data))
}

export const demoService = {
    getAll: async (table, userId) => {
        await new Promise(r => setTimeout(r, 500)) // Fake latency
        const items = getStore(table)
        // Filter by user mostly to simulate real behavior, mostly irrelevant in local demo
        return { data: items, error: null }
    },

    getById: async (table, id) => {
        const items = getStore(table)
        const item = items.find(i => i.id === id)
        return { data: item, error: null }
    },

    create: async (table, item) => {
        await new Promise(r => setTimeout(r, 500))
        const items = getStore(table)
        const newItem = {
            ...item,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
        }
        items.unshift(newItem)
        setStore(table, items)
        return { data: newItem, error: null }
    },

    update: async (table, id, updates) => {
        await new Promise(r => setTimeout(r, 500))
        const items = getStore(table)
        const index = items.findIndex(i => i.id === id)
        if (index === -1) return { data: null, error: { message: 'Not found' } }

        items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() }
        setStore(table, items)
        return { data: items[index], error: null }
    },

    delete: async (table, id) => {
        await new Promise(r => setTimeout(r, 500))
        const items = getStore(table)
        const newItems = items.filter(i => i.id !== id)
        setStore(table, newItems)
        return { error: null }
    },

    // Specific queries
    getByForeignKey: async (table, key, value) => {
        const items = getStore(table)
        const filtered = items.filter(i => i[key] === value)
        // sort by date desc if possible
        filtered.sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha))
        return { data: filtered, error: null }
    }
}
