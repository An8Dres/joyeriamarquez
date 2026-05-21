const page = document.querySelector('.page')
const moreProducts = document.querySelector('.more-products')
const productPage = document.getElementById('product-page')
const btnBack = productPage.querySelector('#btn-back')
const btnFav = productPage.querySelector('#btn-fav')
const inputCantidad = document.getElementById('input-cantidad')
const btnMenos = document.getElementById('btn-menos')
const btnMas = document.getElementById('btn-mas')
const btnCompartir = document.getElementById('btn-share')
const spin = document.querySelector('.spin')

history.scrollRestoration = 'manual'

const PPE = { //PRoduct Page Elements
  __proto__: null,
  title: productPage.querySelector('h2'),
  image: productPage.querySelector('img'),
  price: productPage.querySelector('.price'),
  lastprice: productPage.querySelector('.lastprice'),
  stock: productPage.querySelector('.product-page-stock'),
  type: productPage.querySelector('.product-page-type span'),
  description: productPage.querySelector('.product-page-description'),
}

let lastLoaded = 0
let isLoaded = false

page.onclick = e => {
  const i = e.target.closest('.product')

  if (!i) return

  const id = i.dataset.id
  const image = PPE.image

  if (id  !== lastLoaded) {
    lastLoaded = id
    //Reiniciar estilos
    spin.classList.remove('hidden')
    image.srcset = i.querySelector('img').srcset
    if (!image.complete) image.classList.remove('visible')

    const pInfo = i.querySelector('.pdt-info').dataset
    PPE.type.textContent = pInfo.type
    PPE.stock.textContent = "Stock " + pInfo.stock
    PPE.title.textContent = i.querySelector('.pdt-name').textContent
    PPE.price.textContent = i.querySelector('b').textContent
    PPE.lastprice.textContent = i.querySelector('s').textContent
    PPE.description.textContent = i.querySelector('.pdt-name--extra').textContent
  } else {
    image.classList.add('visible')
  }

  productPage.classList.add('active')

  const myUrl = `/product/${id}/${parserURL(PPE.title.textContent)}`

  if (location.pathname !== myUrl) {
    if (history.state && history.state.esArticulo) {
      history.replaceState({ esArticulo: true }, "", myUrl)
    } else {
      history.pushState({ esArticulo: true }, "", myUrl)
    }
  }
}

function parserURL(text) {
  return text
  .toLowerCase()
  .normalize("NFD") // separa acentos
  .replace(/[\u0300-\u036f]/g, "") // elimina acentos
  .replace(/[^a-z0-9\s-]/g, "") // elimina símbolos
  .trim()
  .replace(/\s+/g, "-") // espacios -> -
  .replace(/-+/g, "-"); // evita ---
}

window.onpopstate = ()=> {
  if (location.pathname.includes('/product/')) {
    productPage.classList.add('active')
    // TODO: if (lastLoaded === 0) cargarUnicoProducto(id)
  }
  else productPage.classList.remove('active')
}

PPE.image.onload = ()=> {
  PPE.image.classList.add('visible')
  spin.classList.add('hidden')
}

import hola from "./cargaScroll.js"
import Notify from "./utils/Notify.js"

btnBack.onclick = ()=> history.back()

btnFav.onclick = ()=> btnFav.classList.toggle('active')

btnCompartir.onclick = ()=> Notify.show({ title: "¡Enlace copiado!", text: "Enlace copiado al portapapeles.", handler: () => navigator.clipboard.writeText(location.href) })

productPage.onclick = e => {
  const i = e.target
  
  if (i.parentNode === document.body) history.back()
  else if (i == btnMenos) {
    if (inputCantidad.value < 2) inputCantidad.value = 1
    else inputCantidad.value--
  } else if (i == btnMas) {
    if (inputCantidad.value > 98) inputCantidad.value = 99
    else inputCantidad.value++
  }
}

//Scroll
let lastScroll = window.scrollY
const header = document.querySelector('header')

window.addEventListener('scroll', e => {
  if (window.scrollY > lastScroll) header.classList.add('ocultar')
  else header.classList.remove('ocultar')
  lastScroll = window.scrollY
})

//Whatsapp
const btnWhatsapp = productPage.querySelector('#btn-buy')
btnWhatsapp.onclick = e => {
  let message = `¡Hola! Quiero comprar esto: ${location.href}`
  window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
}

//Templates
const Templates = document.querySelector('.templates')
const tmpProduct = Templates.querySelector('template').content

function insertarProductos(array) {
  for (let i = 0; i < array.length; i++) {
    const tmp = tmpProduct.cloneNode(true).querySelector('.product')
    const im = tmp.querySelector('img')
    const n = tmp.querySelector('.pdt-name')
    const d = tmp.querySelector('.pdt-name--extra')
    const info = tmp.querySelector('.pdt-info')
    const price = tmp.querySelector('.pdt-price')
    const p = price.querySelector('b')
    const lp = price.querySelector('s')
    const e = array[i]
    
    tmp.dataset.id = e.id
    info.dataset.type = e.tipo
    info.dataset.stock = e.stock
    im.srcset = e.main_image_id
    n.textContent = e.titulo
    d.textContent = e.info
    p.textContent = "$ " + e.precio
    lp.textContent = "$ " + e.precio_anterior


    moreProducts.appendChild(tmp)
  }
}

async function cargarProductos(offset) {
  const query = await fetch('/productos', { 
    method: 'POST',
    headers: { 'Content-Type': 'text/plain'},
    body: offset || 0 
  })
  const data = await query.json()
  return data
}

insertarProductos(await cargarProductos())

export { cargarProductos, insertarProductos }