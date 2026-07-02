export function tplNuevos(array) {
  let htmlBuffer = ''

  for (let i = 0; i < array.length; i++) {
    const prod = array[i]
    htmlBuffer += `
      <a href="${prod.href}" class="product" data-id="${prod.id}">
        <div class="pdt-image">
          <button aria-label="button add to favorites" class="pdt-btn like">
            <svg aria-hidden="true"><use href="#icon-favorite"></use></svg>
            <svg aria-hidden="true"><use href="#icon-favorite-filled"></use></svg>
          </button>
          <img sizes="360px" alt="producto" decoding="async" loading="lazy" srcset="${prod.main_image_id}">
        </div>
        <div class="pdt-info" data-type="${prod.tipo}" data-stock="${prod.stock}">
          <span class="pdt-name">${prod.titulo}</span>
          <span class="pdt-description">${prod.info}</span>
        <span class="pdt-price"><b>${prod.precio}</b><s>${prod.precio_anterior}</s></span>
        </div>
      </a>
    `
  }

  return htmlBuffer
}

export function tplPopulares(array) {
  let htmlBuffer = ''

  for (let i = 0; i < array.length; i++) {
    const prod = array[i]
    htmlBuffer += `
      <a href="${prod.href}" class="product" data-id="${prod.id}">
        <div class="pdt-image">
          <span class="pdt-target">Más vendido</span>
          <img sizes="300px" alt="producto" decoding="async" loading="lazy" srcset="${prod.main_image_id}">
        </div>
        <div class="pdt-info" data-type="${prod.tipo}" data-stock="${prod.stock}">
          <span class="pdt-name">${prod.titulo}</span>
          <span class="pdt-description">${prod.info}</span>
        <span class="pdt-price"><b>${prod.precio}</b><s>${prod.precio_anterior}</s></span>
        </div>
      </a>
    `
  }

  return htmlBuffer
}

let recentOffset = 20
let popularOffset = 0
let isLoading = false

let UI, api

async function cargarNuevos() {
  const productos = await api.productos.getNuevos(recentOffset)
  const len = productos.length

  recentOffset += len

  if (len === 0) return

  UI.recentContainer.insertAdjacentHTML('beforeend', tplNuevos(productos))
}

async function cargarPopulares() {
  const productos = await api.productos.getPopulares(popularOffset)
  const len = productos.length

  popularOffset += len

  if (len === 0) return

  UI.popularContainer.insertAdjacentHTML('beforeend', tplPopulares(productos))
}

export async function init() {
  const Modal = await import('./modal.js')
  api = (await import('../services/api.js')).default
  UI = await import('../ui/dom.js')

  Modal.init()
  // UI.cartCounter.textContent = localStorage.getItem('cart') || 0

  UI.mainSection.onscroll = ()=> {
    if (!isLoading && UI.mainSection.scrollTop > UI.mainSection.scrollHeight * 0.6){
      isLoading = true
      cargarNuevos()
      setTimeout(()=> {isLoading = false}, 300)
    }
  }

  UI.catalogContainer.onclick = e => {
    let i = e.target.closest('.like')
    if (i) {
      i.classList.toggle('liked')
      
      return
    }

    i = e.target.closest('.product')
    if (i) Modal.show(i) // Click on card
  }
}