import fs from 'node:fs'

const initialProductCount = 15
const productsPath = process.cwd() + "/server/db.json"

export default class Products {
  static #products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

  static #bucle(array = [], to = 0, from = 0, hasLazyLoading = true) {
    let result = ''

    for (let i = to; i < from; i++) {
      if (i >= array.length) break
      const p = array[i]
      const property = hasLazyLoading ? 'loading="lazy"' : ''

      result += 
      `<a href="${p.slug}" class="product-card" data-id="${p.id}">
        <section class="product-card__image">
          <picture>
          <!-- <source srcset="src/pdts/front/avif/${p.id}.avif"> -->
            <img ${property} src="src/pdts/front/webp/${p.id}.webp" alt="Producto para mujer">
          </picture>
        </section>
        <section class="product-card__info">
          <svg area-hidden="true" class="product-card__type"><use href="#icon-${p.type}"></use></svg>
          <p class="product-card__name">${p.name}</p>
          <span class="product-card__price">$${p.price}</span>
          <button class="product-card__btn--add">AGREGAR</button>
        </section>
      </a>`
    }

    return result
  }

  static initLoad(type = null) {
    let filter = [...this.#products]

    if (type) {
      filter = this.#products.filter(p => p.type == type)
    }

    let result = this.#bucle(filter, 0, 6, false)
    result += this.#bucle(filter, 6, initialProductCount)
    //TODO: contador de productos cargados para no mandar los mismos siempre
    return result
  }

  static get() {
    return this.#products
  }

  static refresh() {
    this.#products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
  }
}