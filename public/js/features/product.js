import { cartCounter, mainSection } from '/js/ui/dom.js'
import { api } from '/js/services/api.js'

let productModal

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function loadFromCard(card) {
  const info = card.querySelector('.pdt-info').dataset

  return {
    __proto__: null,
    main_image_id: card.querySelector('img').srcset,
    titulo: card.querySelector('.pdt-name').textContent,
    tipo: info.type, stock: info.stock,
    precio: card.querySelector('b').textContent,
    precio_anterior: card.querySelector('s').textContent,
    info: card.querySelector('.pdt-description').textContent
  }
}

async function loadMissingData(url) {
  const id = url.split('/')[4]
  const card = mainSection.querySelector(`a[data-id="${id}"]`)
  if (card) return loadFromCard(card)
  else return (await api.productos.get(id))[0]
}

function pickerBlur(event) {
  if (event.target.matches('.product input[type=number]')) {
    const input = event.target
    
    let val = +input.value

    if (isNaN(val) || input.value === '') {
      input.value = 1
      return
    }

    input.value = Math.max(1, Math.min(99, val))
  }
}

export function atras() {
  if (history.state.isLastState) location.href = '/'
  else history.back()
}

export async function compartir() {
  const url = location.href.substring(0, location.href.lastIndexOf('/'))
  const { Notify } = await import('./Notify.js')
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

export function guardarEnCarrito(button) {
  const product = button.closest('.product-container')
  const input = product.querySelector('.product-picker input')
  
  let value = +cartCounter.textContent + (+input.value)
  localStorage.setItem('cart', value)
  cartCounter.textContent = value > 99 ? '+99' : value
}

export function template({view}) {
  return `<article id="product" class="page ${view === 'modal' ? 'modal' : ''}" data-click="back">
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
          <img srcset="" decoding="async" sizes="max(500px, 60vw)"
            alt="product image">
        </div>
      </section>
      <section>
        <h2></h2>
        <div class="product-info">
          <span class="product-stock">Stock</span>
          <span class="product-type">Tipo</span>
        </div>
        <div class="product-prices">
          <div>
            <p>Ahora</p>
            <span class="price">
              0,00 COP
            </span>
          </div>
          <div>
            <p>Antes</p>
            <s class="lastprice">
              10,00
            </s>
          </div>
        </div>
        <div class="product-picker">
          <p>Cantidad</p>
          <div>
            <button data-action="decrement">-</button>
            <input type="number" value="1" min="1" max="99">
            <button data-action="increment">+</button>
          </div>
        </div>
        <aside class="product-actions">
          <button data-action="whatsapp" class="btn-buy">
            WHATSAPP
          </button>
          <button data-action="add" class="btn-add">
            AGREGAR
            <svg area-hidden="true">
              <use href="#icon-cart-out"></use>
            </svg>
          </button>
        </aside>
        <div class="product-description">
          <p>Descripción</p>
          <p></p>
        </div>
      </section>
    </div>
  </article>`
}

export function init() {
  const modalRoot = document.getElementById('product')

  productModal = {
    __proto__: null,
    root: modalRoot,
    name: modalRoot.querySelector('h2'),
    image: modalRoot.querySelector('img'),
    price: modalRoot.querySelector('.price'),
    lastprice: modalRoot.querySelector('.lastprice'),
    stock: modalRoot.querySelector('.product-stock'),
    type: modalRoot.querySelector('.product-type'),
    description: modalRoot.querySelector('.product-description p:last-child'),
    input: modalRoot.querySelector('.product-picker input')
  }

  productModal.image.decode()
    .then(() => productModal.image.classList.add('visible'))
    .catch(() => null)

  document.onkeydown = e => {
    if (e.target.matches('input[type=number]')) {
      const blocked = ['+', '-', 'E', 'e', '.', ' ']
      if (blocked.includes(e.key)) e.preventDefault()
    }
  }

  document.addEventListener('blur', pickerBlur, true)
}

export async function update(card) {
  productModal.image.classList.remove('visible')

  productModal.root.firstElementChild.scrollTop = 0
  productModal.root.querySelector('section:nth-child(2)').scrollTop = 0

  const data = card instanceof HTMLAnchorElement ?
  loadFromCard(card) : await loadMissingData(card.href)

  productModal.image.srcset = ''

  const tempImg = new Image()
  tempImg.srcset = data.main_image_id

  tempImg.decode().then(() => {
    productModal.image.classList.add('visible')
    productModal.image.srcset = tempImg.srcset
  })

  // if (pdtInfo.stock > 0) '✓ Disponible'

  productModal.type.textContent = data.tipo
  productModal.stock.textContent = `Stock ${data.stock}`
  productModal.name.textContent = data.titulo
  productModal.price.textContent = `${data.precio} COP`
  productModal.lastprice.textContent = `${data.precio_anterior}`
  productModal.description.textContent = data.info
  productModal.input.value = 1
}

export function destroy() {
  document.onkeydown = null
  document.removeEventListener('blur', pickerBlur)
}