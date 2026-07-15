async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    })

    if (res.ok) return await res.json()

  } catch (error) {
    console.error(`Fallo en API [${endpoint}]:`, error)
  }
}

export const api = {
  __proto__: null,

  productos: {
    __proto__: null,
    get: (id) => request('/products/id', { id }),
    getNuevos: (offset) => request('/products/recent', { offset }),
    getPopulares: (offset) => request('/products/popular', { offset })
  },

  carrito: {
    __proto__: null,
    getGuardados: (userId) => request('/cart', { id: userId })
  }
}