import { header, page, mainProductContainer, tmpProduct, productPageModal, PME } from './dom.js'
import Notify from '../utils/Notify.js'

let lastScroll = 0
let lastLoaded = 0
let loaderOffset = 0
let isLoading = false

const { spin, title, image, type, info, stock, lastprice, price, description,
        btnBack, btnFav, btnShare, btnBuy, btnMenos, btnMas, inputCantidad } = PME

//Mostrar modal | Producto
page.onclick = e => {
  const i = e.target.closest('.product')

  if (!i) return

  const id = i.dataset.id

  if (id  !== lastLoaded) {
    lastLoaded = id
    //Reiniciar estilos
    spin.classList.remove('hidden')
    image.srcset = i.querySelector('img').srcset
    if (!image.complete) image.classList.remove('visible')

    const pInfo = i.querySelector('.pdt-info').dataset
    type.textContent = pInfo.type
    stock.textContent = "Stock " + pInfo.stock
    title.textContent = i.querySelector('.pdt-name').textContent
    price.textContent = i.querySelector('b').textContent
    lastprice.textContent = i.querySelector('s').textContent
    description.textContent = i.querySelector('.pdt-name--extra').textContent
  } else {
    image.classList.add('visible')
  }

  productPageModal.classList.add('visible')

  const myUrl = `/product/${id}/${parserURL(title.textContent)}`

  if (location.pathname !== myUrl) {
    if (history.state && history.state.esArticulo) {
      history.replaceState({ esArticulo: true }, "", myUrl)
    } else {
      history.pushState({ esArticulo: true }, "", myUrl)
    }
  }
}

image.onload = ()=> {
  image.classList.add('visible')
  spin.classList.add('hidden')
}

btnBack.onclick = ()=> {
  history.back()
}

btnFav.onclick = ()=> {
  btnFav.classList.toggle('active')
}

btnShare.onclick = ()=> {
  Notify.show({
    title: "¡Enlace copiado!",
    text: "Enlace copiado al portapapeles.",
    handler: () => navigator.clipboard.writeText(location.href)
  })
}

btnBuy.onclick = ()=> {
  let message = `¡Hola! Quiero comprar esto: ${location.href}`
  window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
}

productPageModal.onclick = e => {
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

window.onpopstate = ()=> {
  if (location.pathname.includes('/product/')) {
    productPageModal.classList.add('visible')
    // TODO: if (lastLoaded === 0) cargarUnicoProducto(id)
  }
  else productPageModal.classList.remove('visible')
}
// On MObile
window.onscroll = ()=> {
  if (window.scrollY > lastScroll) header.classList.add('hidden')
  else header.classList.remove('hidden')
  lastScroll = window.scrollY
}

window.addEventListener('scroll', async e => {
  if (!isLoading && window.scrollY > document.body.scrollHeight * 0.6 && loaderOffset < 50) {
    insertarProductos(await cargarProductos(loaderOffset))
  }
})

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

    mainProductContainer.appendChild(tmp)
  }
}

async function cargarProductos(offset) {
  isLoading = true

  const query = await fetch('/productos', { 
    method: 'POST',
    headers: { 'Content-Type': 'text/plain'},
    body: offset || 0
  })
  
  const data = await query.json()
  loaderOffset += data.length
  isLoading = false
  return data
}

export { cargarProductos, insertarProductos }