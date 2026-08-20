export function tplCards(data) {
  let htmlBuffer = ''

  for (let i = 0; data.length; i++) {
    const pdt = data[i]

    htmlBuffer += `<article class="cart-item" data-id="${pdt.id}">
      <header>
        <button class="cart-item__button--remove">✕</button>
        <img src="src/pdts/icon/${item.id}.webp" alt="Producto">
        <div class="cart-item__info">
          <h6 class="cart-item__type">${pdt.tipo.toUpperCase()}</h6>
          <p class="cart-item__name">${pdt.nombre}</p>
          <p class="cart-item__price">$<span class="price">${pdt.precio}</span> COP</p>
        </div>
      </header>
      <div class="cart-item__buttons qty-picker">
        <div class="qty-buttons">
          <button class="qty-btn qty-btn--minus" aria-label="Restar">-</button>
          <input class="qty-input" placeholder="3" type="number" value="${2}" pattern="[0-9]*">
          <button class="qty-btn qty-btn--plus" aria-label="Agregar">+</button>
        </div>
        <p class="qty-total">$<span>${2 * pdt.precio}</span> COP</p>
      </div>
    </article>`
  }

  return htmlBuffer
}

export function template() {
  return `<section id="cart" class="page visible">
  </section>`
}

export function init() {
  console.log('modulo cargado: CART')

  let root = document.getElementById('cart')
}

export function update() {}
