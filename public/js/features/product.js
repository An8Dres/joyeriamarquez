let page

const parser = {
  __proto__: null,
  getNumero(precio) {
    const texto = String(precio)
    const textoSinPuntos = texto.replace(/\./g, "")
    return Number(textoSinPuntos)
  },
  getPrecio(numero) {
    let texto = numero.toString()
    return texto.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
    .toLowerCase()
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

  main({ view, visible, data }) {
    const isModal = view === 'modal' ? 'modal' : ''
    const isVisible = visible === true ? 'visible' : ''
  
    let id, n, i, s, t, d, p, lp

    if (data) {
      id = data.id
      n = data.nombre
      i = parser.getSrcset(data.main_image_id)
      s = data.stock
      t = data.tipo
      d = data.descripcion
      p = parser.getPrecio(data.precio)
      lp = parser.getPrecio(data.precio_anterior)
    }

    return `<article id="product" class="page ${isModal} ${isVisible}" data-id="${id}" data-click="back">
      <div class="product-container">
        <section>
          <header>
            <button data-action="back" class="btn-back" aria-label="go back">
              <svg area-hidden="true">
                <use href="#icon-arrowback"></use>
              </svg>
            </button>
            <div>
              <button data-action="like" class="btn-like toggleable" aria-label="add to favorite">
                <svg area-hidden="true">
                  <use href="#icon-favorite"></use>
                </svg>
                <svg area-hidden="true">
                  <use href="#icon-favorite-filled"></use>
                </svg>
              </button>
              <button data-action="share" class="btn-share" aria-label="share product">
                <svg area-hidden="true">
                  <use href="#icon-share"></use>
                </svg>
              </button>
            </div>
          </header>
          <div class="product-images">
            <img srcset="${i}" decoding="async" sizes="max(500px, 60vw)"
              alt="product image">
          </div>
        </section>
        <section>
          <h2>${n}</h2>
          <div class="product-info">
            <span class="product-stock">${s > 1 ? '✓ Disponible' : `Stock ${s}`}</span>
            <span class="product-type">${t}</span>
          </div>
          <div class="product-prices">
            <div class="price">
              <p>${p}</p>
              <span>COP</span>
            </div>
            <p class="lastprice">${lp}</p>
          </div>
          <div class="product-picker">
            <button data-action="decrement"></button>
            <input type="number" value="1" min="1" max="99">
            <button data-action="increment"></button>
          </div>
          <aside class="product-actions">
            <button data-action="whatsapp" class="btn-buy">
              COMPRAR
              <svg area-hidden="true">
                <use href="#icon-wa"></use>
              </svg>
            </button>
            <button data-action="add" class="btn-add">
              AGREGAR
              <svg area-hidden="true">
                <use href="#icon-cart-out"></use>
              </svg>
            </button>
          </aside>
          <div class="product-description">
            <p>${d}</p>
          </div>
        </section>
      </div>
    </article>`
  }
}

function pickerBlur(event) {
  if (event.target.matches('input[type=number]')) {
    const input = event.target
    
    let val = +input.value

    if (isNaN(val) || input.value === '') {
      input.value = 1
      return
    }

    input.value = Math.max(1, Math.min(99, val))
  }
}

async function cargarDatos(card) {
  let id = card.dataset?.id
  let info = card instanceof HTMLAnchorElement ?
  card.querySelector('.pdt-info') : null //Only has main cards

  if (!id) id = card.href.split('/')[4]

  if (!info) {
    card = document.getElementById('home')
    ?.querySelector(`a[data-id="${id}"]`)
  }

  if (!card) {
    const datos = await api.productos.get(id)
    return datos[0]
  } else {
    info = card.querySelector('.pdt-info').dataset
  }

  return {
    __proto__: null,
    id,
    nombre: card.querySelector('.pdt-name').textContent,
    srcset: card.querySelector('img').srcset,
    stock: info.stock,
    tipo: info.tipo,
    precio: card.querySelector('b').textContent,
    precio_anterior: card.querySelector('s').textContent,
    descripcion: card.querySelector('.pdt-description').textContent
  }
}

export function atras() {
  if (history.state.isFirstState) location.href = '/'
  else history.back()
}

export async function compartir() {
  const url = location.href.substring(0, location.href.lastIndexOf('/'))
  
  Notify.show({
    title: "¡Enlace copiado!",
    text: "Enlace copiado al portapapeles.",
    handler: () => navigator.clipboard.writeText(url)
  })
}

export function manejarLike(button) {
  button.classList.toggle('active')
}

export function manejarContador(button) {
  if (button.dataset.action === 'decrement') {
    const input = button.nextElementSibling
    input.stepDown()
  } else {
    const input = button.previousElementSibling
    input.stepUp()
  }
}

export function contactarWhatsapp() {
  const url = location.href.substring(0, location.href.lastIndexOf('/'))
  let message = `¡Hola! Quiero comprar esto: ${url}`
  window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
}

export function obtenerDatosCarrito() {
  return {
    __proto__: null,
    id: page.root.dataset.id,
    qty: page.input.value
  }
}

// export function guardarEnCarrito(button) {
//   const product = button.closest('.product-container')
//   const input = product.querySelector('.product-picker input')
  
//   let value = +cartCounter.textContent + (+input.value)
//   localStorage.setItem('cart', value)
//   cartCounter.textContent = value > 99 ? '+99' : value
// }

//Router config

export async function init() {
  const root = mainSection.lastElementChild

  page = {
    __proto__: null,
    root,
    name: root.querySelector('h2'),
    image: root.querySelector('img'),
    stock: root.querySelector('.product-stock'),
    type: root.querySelector('.product-type'),
    info: root.querySelector('.product-info'),
    price: root.querySelector('.price p'),
    lastprice: root.querySelector('.lastprice'),
    description: root.querySelector('.product-description p'),
    input: root.querySelector('.product-picker input')
  }

  page.image.decode()
    .then(() => page.image.classList.add('visible'))
    .catch(() => null)

  document.onkeydown = e => {
    if (e.target.matches('input[type=number]')) {
      const blocked = ['+', '-', 'E', 'e', '.', ' ']
      if (blocked.includes(e.key)) e.preventDefault()
    }
  }

  document.addEventListener('blur', pickerBlur, true)

  return root
}

export async function update(card) {
  page.image.classList.remove('visible')

  page.root.querySelector('section:nth-child(2)').scrollTop = 0

  const data = await cargarDatos(card)

  page.image.srcset = ''

  const tempImg = new Image()

  if (data.srcset) {
    tempImg.srcset = data.srcset
  } else {
    tempImg.srcset = parser.getSrcset(data.main_image_id)
    data.precio = parser.getPrecio(data.precio)
    data.precio_anterior = parser.getPrecio(data.precio_anterior)
  }

  tempImg.decode().then(() => {
    page.image.classList.add('visible')
    page.image.srcset = tempImg.srcset
  })

  const stock = data.stock > 1 ? '✓ Disponible' : `Stock ${data.stock}`

  page.root.dataset.id = data.id
  page.name.textContent = data.nombre
  page.type.textContent = data.tipo
  page.stock.textContent = stock
  page.price.textContent = data.precio
  page.lastprice.textContent = data.precio_anterior
  page.description.textContent = data.descripcion
  page.input.value = 1
}

export function destroy() {
  document.onkeydown = null
  document.removeEventListener('blur', pickerBlur)
}