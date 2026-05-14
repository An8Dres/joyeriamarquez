import Format from '../public/src/js/utils/Format.js'
import Products from './Products.mjs'

export function filtrarCompartidos(productosCompartidos) {
  let cantidad = 0
  let result = ""
  let total = 0

  productosCompartidos.forEach(ps => {
    const p =  Products.get().find(p => p.id == ps.id)
    let calculoTotalProducto

    if (p) {
      calculoTotalProducto = Format.mult(ps.cant, p.price)

      result +=
      `<article class="item-card">
        <header>
          <img src="src/pdts/icon/${p.id}.webp" alt="Producto">
          <div class="item-card__info">
            <h6 class="item-card__type">${p.type.toUpperCase()}</h6>
            <p class="item-card__name">${p.name}</p>
            <p class="item-card__price">$<span>${p.price}</span> COP</p>
          </div>
        </header>
        <div class="item-card__buttons">
          <p class="item-card__cantity">x${ps.cant}</p>
          <p class="item-card__total">$<span>${calculoTotalProducto}</span> COP</p>
        </div>
      </article>`

      cantidad += parseInt(ps.cant)
      total = Format.sum(total, calculoTotalProducto)
    }
  })

  return { result, cantidad, total }
}