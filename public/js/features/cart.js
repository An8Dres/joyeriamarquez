let page

const CLAVE_CARRITO = "ecommerce_carrito_pruebas"

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
  getSrcset(imagenId) {
    const IMG_SIZES = ['165', '360', '533', '720', '940']
    let url = ""
    for (let i = 0; i < IMG_SIZES.length; i++) {
      const SIZE = IMG_SIZES[i]
      url += `https://napoleonejoyas.co/cdn/shop/files/${imagenId}_x${SIZE}.jpg ${SIZE}w, ` // CDN/image.jpg
    }
    return url.substring(0, url.length - 2)
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
  main() {
    return `
    <article id="cart" class="page visible">
      <h1>Carrito de Compras</h1>
      <div>
      <section class="cart-items">
      </section>
      <section class="cart-resume">
        <section>
          <h2>Resumen del pedido</h2>
          <div>
            <p class="cantidad-articulos">Total de artículos (0)</p>
            <span class="total-articulos">$0.00</span>
          </div>
          <div>
            <p>Envío Estimado</p>
            <span>Gratis</span>
          </div>
          <div>
            <p>Descuentos Aplicados</p>
            <span>N/A</span>
          </div>
          <hr>
          <div>
            <p>Total a pagar</p>
            <p class="total-final">$0.00</p>
          </div>
          <button>
            Proceder al Pago
            <svg aria-hidden="true"><use href="#icon-lock"></use></svg>
          </button>
          </section>
        </section>
      </div>
    </article>`
  },
  cards(data, qtys) {
    let htmlBuffer = ''

    for (let i = 0; i < data.length; i++) {
      const p = data[i]
      const qty = qtys[i]
      htmlBuffer +=
      `<a href="/product/${p.id}/" class="cart-item" data-id="${p.id}" data-action="modal">
        <img src="https://napoleonejoyas.co/cdn/shop/files/${p.main_image_id}_x144.jpg" alt="Imagen del producto, manilla de oro">
        <div class="cart-item__right">
          <p>${p.nombre}</p>
          <div class="price">
            <p>${parser.getPrecio(p.precio)}</p>
            <span>COP</span>
          </div>
          <div class="cart-item__actions">
            <div class="product-picker">
              <button data-action="decrement"></button>
              <input type="number" value="${qty}" min="1" max="99">
              <button data-action="increment"></button>
            </div>
            <p class="total" data-precio="${p.precio}" data-cantidad="${qty}">
              ${parser.getPrecio(p.precio * qty)}
            </p>
            <button class="btn-remove" data-action="remove">
              <svg><use href="#icon-trash"></use></svg>
            </button>
          </div>
        </div>
      </a>`
    }
    return htmlBuffer
  }
}

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem(CLAVE_CARRITO)
  return carritoGuardado ? JSON.parse(carritoGuardado) : []
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
}

function actualizarCantidad(carrito) {
  const cantidad = carrito.reduce((acc, item) => acc + Number(item.qty), 0)

  if (cantidad === 0) {
    cartCounter.classList.remove('visible')
    localStorage.removeItem('cart-counter')
  } else {
    cartCounter.textContent = cantidad > 99 ? '+99' : cantidad
    cartCounter.classList.add('visible')
    localStorage.setItem('cart-counter', cantidad)
  }

  btnCart.classList.add('adding')
  setTimeout(() => {
    btnCart.classList.remove('adding')
  }, 500)
}

export async function agregarProducto() {
  const carrito = obtenerCarrito()
  const producto = (await import('/js/features/product.js')).obtenerDatosCarrito()
  
  const productoExistente = carrito.find(item => item.id === producto.id)

  if (productoExistente) {
    const cantidadActual = Number(productoExistente.qty)
    productoExistente.qty = cantidadActual + Number(producto.qty)
  } else {
    carrito.push(producto)
  }

  guardarCarrito(carrito)

  actualizarCantidad(carrito)

  //Callback de agregado
}

export function removerProducto(button) {
  const card = button.closest('a')

  const carrito = obtenerCarrito().filter(i => i.id !== card.dataset.id)

  guardarCarrito(carrito)

  actualizarCantidad(carrito)

  card.parentNode.removeChild(card)
}

function actualizarDatos() {
  let total = 0
  let totalArticulos = 0

  const articulos = page.items.querySelectorAll('.cart-item__actions .total')

  articulos.forEach(a => {
    const precio = Number(a.dataset.precio)
    const cantidad = Number(a.dataset.cantidad)
    total += precio * cantidad
    totalArticulos += cantidad
  })

  total = '$' + parser.getPrecio(total)

  page.cantidadArticulos.textContent = `Total de artículos (${totalArticulos})`
  page.totalArticulos.textContent = total
  page.totalFinal.textContent = total
}

//Router config
export async function init() {
  const root = mainSection.lastElementChild

  page = {
    __proto__: null,
    root,
    items: root.querySelector('.cart-items'),
    resume: root.querySelector('.cart-resume'),
    cantidadArticulos: root.querySelector('.cart-resume .cantidad-articulos'),
    totalArticulos: root.querySelector('.cart-resume .total-articulos'),
    totalFinal: root.querySelector('.cart-resume .total-final')
  }

  const carrito = obtenerCarrito()
  const ids = carrito.map(i => i.id)
  const qtys = carrito.map(i => i.qty)
  
  const productos = await api.carrito.get(ids)

  page.items.insertAdjacentHTML('beforeend', templates.cards(productos, qtys))

  actualizarDatos()

  return root
}

export async function update() {
  alert('Actualizando carrito...')
  // Actualizar dirtys y nuevos productos
}