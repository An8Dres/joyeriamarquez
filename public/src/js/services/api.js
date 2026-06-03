class ApiClient {
  constructor() {
    if (ApiClient.instance) return ApiClient.instance
    ApiClient.instance = this
  }

  async #request(endpoint, options = {}) {
    try {
      const res = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      })

      if (res.ok) return await res.json()

    } catch (error) {
      console.error(`🚨 Fallo en API [${endpoint}]:`, error)
      throw error
    }
  }

  // Métodos públicos
  productos = {
    getPopular: (offset) => this.#request('/products/popular', { offset }),
    getRecientes: (offset) => this.#request('/products/recent', { offset })
  }

  carrito = {
    getGuardados: (userId) => this.#request('/cart', { id: userId })
  }
}

const api = new ApiClient()

Object.freeze(api)

export default api