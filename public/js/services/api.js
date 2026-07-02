async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    })

    if (res.ok) return await res.json()

  } catch (error) {
    console.error(`🚨 Fallo en API [${endpoint}]:`, error)
  }
}

const api = {
  __proto__: null,

  productos: {
    __proto__: null,
    getNuevos: (offset) => request('/products/recent', { offset }),
    getPopular: (offset) => request('/products/popular', { offset })
  },

  carrito: {
    __proto__: null,
    getGuardados: (userId) => request('/cart', { id: userId })
  }
}

Object.freeze(api)

export default api