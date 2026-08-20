let homePage
let recentId = 0
let popularId = 0
let isLoading = false
let api, ui

export function tplNuevos(array) {
  let htmlBuffer = ''

  for (let i = 0; i < array.length; i++) {
    const prod = array[i]
    htmlBuffer += `
      <a href="${prod.href}" class="product-card" data-id="${prod.id}" data-action="modal">
        <div class="pdt-image">
          <button class="pdt-btn toggleable" data-action="like" aria-label="button add to favorites">
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
      <a href="${prod.href}" class="product-card" data-id="${prod.id}" data-action="modal">
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

async function cargarNuevos() {
  const productos = await api.productos.getNuevos(recentId)
  const len = productos.length

  if (len === 0) return

  recentId = productos[len - 1]?.id || recentId

  homePage.recentContainer.insertAdjacentHTML('beforeend', tplNuevos(productos))
}

async function cargarPopulares() {
  const productos = await api.productos.getPopulares(popularId)
  const len = productos.length

  if (len === 0) return

  popularId = productos[len - 1]?.id || popularId

  homePage.popularContainer.insertAdjacentHTML('beforeend', tplPopulares(productos))
}

export function template() {
  return `<section id="home" class="page visible">
    <div class="add-panel">
      <img src="/iconos/banner.avif" alt="Banner add product">
      <div>
        <h2>EDICIÓN LIMITADA: LA COLECCIÓN DE ESMERALDAS REALEZA</h2>
        <p>Joyas artesanales con el más fino oro de 18k y gemas certificadas. Diseñadas para deslumbrar.</p>
        <button>VER LA COLECCIÓN</button>
      </div>
    </div>
    <div id="popular-card__container">
      <header>
        <h2>Populares</h2>
        <button>Ver todos</button>
      </header>
      <div>
      </div>
    </div>
    <div id="main-card__container">
      <header><h2>Todos</h2></header>
      <div>
      </div>
    </div>
  </section>`
}

export async function init() {
  [ui, { api }] = await Promise.all([
    import('/js/ui/dom.js'),
    import('/js/services/api.js')
  ])

  const root = ui.mainSection.querySelector('#home')

  homePage = {
    __proto__: null,
    root,
    recentContainer: root.querySelector('#main-card__container div'),
    popularContainer: root.querySelector('#popular-card__container div')
  }
  
  root.onscroll = async ()=> {
    if (!isLoading && root.scrollTop > root.scrollHeight * 0.6){
      isLoading = true
      await cargarNuevos()
      setTimeout(()=> {isLoading = false}, 100)
    }
  }

  if (homePage.popularContainer.lastElementChild !== null) {
    recentId = homePage.recentContainer.lastElementChild.dataset.id
    popularId = homePage.popularContainer.lastElementChild.dataset.id
  }
}

export async function update() {
  cargarPopulares()
  cargarNuevos()
}

export function destroy() {
  homePage.root.onscroll = null
  homePage = null
}