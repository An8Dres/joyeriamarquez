let page

let recentId = 0
let popularId = 0
let isLoading = false

const parser = {
  __proto__: null,
  getNumero(precio) {
    const texto = String(precio)
    const textoSinPuntos = texto.replace(/\./g, "")
    return Number(textoSinPuntos)
  },
  getPrecio(numero) {
    let texto = numero?.toString()
    return texto?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  },
  getSrcset(urlOriginal) {
    //generar Srcset para Cloudinary
    const anchos = [300, 600, 900, 1200, 1800]
    
    const uploadIndex = urlOriginal.indexOf('/upload/');
    
    if (uploadIndex === -1) return urlOriginal

    const basePart = urlOriginal.substring(0, uploadIndex + 8)
    const imageId = urlOriginal.substring(uploadIndex + 8)

    const lineasSrcset = anchos.map(ancho => {
      const parametros = `w_${ancho},f_auto,q_auto`;
      const urlTransformada = `${basePart}${parametros}/${imageId}`;
      
      return `${urlTransformada} ${ancho}w`
    });

    return lineasSrcset.join(',\n')
  },
  getURL(nombre) {
    return nombre
    ?.toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-z0-9\s-]/g, "") // elimina símbolos
    .trim()
    .replace(/\s+/g, "-") // espacios -> -
    .replace(/-+/g, "-") // evita ---
  }
}

export const templates = {
  __proto__: null,
  main({ visible }) {
    const isVisible = visible === true ? 'visible' : ''

    let part1 = `
    <article id="home" class="page ${isVisible}">
      <div class="add-panel">
        <img src="/images/banner-phone.webp" sizes="100vw" srcset="/images/banner-phone.webp 320w, /images/banner-tablet.webp 768w, /images/banner-desktop.webp 1024w" alt="Banner add product">
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
        <div>`
    let part2 = `
        </div>
      </div>
      <div id="main-card__container">
        <header><h2>Todos</h2></header>
        <div>`
    let part3 = `
        </div>
      </div>
    </article>`

    return [part1, '', part2, '', part3]
  },
  populares(array) {
    let htmlBuffer = ''

    for (let i = 0; i < array.length; i++) {
      const p = array[i]
      htmlBuffer += `
      <a href="/product/${p.id}/${parser.getURL(p.nombre)}" class="product-card" data-id="${p.id}" data-action="modal">
        <div class="pdt-image">
          <span class="pdt-target">Más vendido</span>
          <img sizes="300px" alt="producto" decoding="async" loading="lazy" srcset="${parser.getSrcset(p.main_image_id)}">
        </div>
        <div class="pdt-info" data-tipo="${p.tipo}" data-stock="${p.stock}" data-precio="${p.precio}">
          <span class="pdt-name">${p.nombre}</span>
          <span class="pdt-description">${p.descripcion}</span>
        <span class="pdt-price"><b>${parser.getPrecio(p.precio)}</b><s>${parser.getPrecio(p.precio_anterior)}</s></span>
        </div>
      </a>`
    }
    return htmlBuffer
  },
  nuevos(array) {
    let htmlBuffer = ''

    for (let i = 0; i < array.length; i++) {
    const p = array[i]
    htmlBuffer += `
      <a href="/product/${p.id}/${parser.getURL(p.nombre)}" class="product-card" data-id="${p.id}" data-action="modal">
        <div class="pdt-image">
          <button class="pdt-btn toggleable" data-action="like" aria-label="button add to favorites">
            <svg aria-hidden="true"><use href="#icon-favorite"></use></svg>
            <svg aria-hidden="true"><use href="#icon-favorite-filled"></use></svg>
          </button>
          <img sizes="300px" alt="producto" decoding="async" loading="lazy" srcset="${parser.getSrcset(p.main_image_id)}">
        </div>
        <div class="pdt-info" "data-imagen="${p.main_image_id}" data-tipo="${p.tipo}" data-stock="${p.stock}" data-precio="${p.precio}">
          <span class="pdt-name">${p.nombre}</span>
          <span class="pdt-description">${p.descripcion}</span>
        <span class="pdt-price"><b>${parser.getPrecio(p.precio)}</b><s>${parser.getPrecio(p.precio_anterior)}</s></span>
        </div>
      </a>`
    }
    return htmlBuffer
  },
}

async function cargarNuevos() {
  const productos = await api.productos.getNuevos(recentId)
  const len = productos.length

  if (len === 0) return

  recentId = productos[len - 1]?.id || recentId

  page.recentContainer.insertAdjacentHTML('beforeend', templates.nuevos(productos))
}

async function cargarPopulares() {
  const productos = await api.productos.getPopulares(popularId)
  const len = productos.length

  if (len === 0) return

  popularId = productos[len - 1]?.id || popularId

  page.popularContainer.insertAdjacentHTML('beforeend', templates.populares(productos))
}

//Router config
export async function init() {
  const root = mainSection.lastElementChild

  page = {
    __proto__: null,
    root,
    recentContainer: root.querySelector('#main-card__container div'),
    popularContainer: root.querySelector('#popular-card__container div')
  }

  if (page.popularContainer.lastElementChild !== null) {
    recentId = page.recentContainer.lastElementChild.dataset.id
    popularId = page.popularContainer.lastElementChild.dataset.id
  }

  root.onscroll = async () => {
    if (!isLoading && root.scrollTop > root.scrollHeight * 0.6){
      isLoading = true
      await cargarNuevos()
      isLoading = false
    }
  }

  root.classList.add('visible')

  return root
}

export async function update() {
  cargarPopulares()
  cargarNuevos()

  // cuando hayan pasado 5 min o así
}

export function destroy() {
  page.root.onscroll = null
  page = null
}