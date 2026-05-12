const page = document.querySelector('.page')
const moreProducts = document.querySelector('.more-products')
const productPage = document.getElementById('product-page')
const btnBack = productPage.querySelector('#btn-back')
const btnFav = productPage.querySelector('#btn-fav')
const inputCantidad = document.getElementById('input-cantidad')
const btnMenos = document.getElementById('btn-menos')
const btnMas = document.getElementById('btn-mas')


const PPE = { //PRoduct Page Elements
  __proto__: null,
  title: productPage.querySelector('h2'),
  image: productPage.querySelector('img'),
  price: productPage.querySelector('.price'),
  lastprice: productPage.querySelector('.lastprice'),
  type: productPage.querySelector('.product-page-type span'),
  description: productPage.querySelector('.product-page-description')
}

let lastLoaded = 0
let isLoaded = false

page.onclick = e => {
  PPE.image.classList.remove('visible')
  const i = e.target.closest('.product')
  if (!i) return
  const id = i.dataset.id
  if (id  !== lastLoaded) {
    lastLoaded = id
    PPE.image.srcset = i.querySelector('img').srcset
    PPE.title.textContent = i.querySelector('.pdt-name').textContent
    PPE.price.textContent = i.querySelector('b').textContent
    PPE.lastprice.textContent = i.querySelector('s').textContent
    PPE.type.textContent = i.querySelector('.pdt-info').dataset.type
    PPE.description.textContent = i.querySelector('.pdt-name--extra').textContent

  } else {
    PPE.image.classList.add('visible')
  }

  productPage.classList.add('active')
}

PPE.image.onload = () => PPE.image.classList.add('visible')

btnBack.onclick = () => productPage.classList.remove('active')
btnFav.onclick = () => btnFav.classList.toggle('active')

productPage.onclick = e => {
  const i = e.target
  
  if (i.parentNode === document.body) productPage.classList.remove('active')
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

window.onscroll = e => {
  if (window.scrollY > lastScroll) header.classList.add('ocultar')
  else header.classList.remove('ocultar')
  lastScroll = window.scrollY
}

//Whatsapp
const btnWhatsapp = productPage.querySelector('#btn-buy')
btnWhatsapp.onclick = e => {
  let message = `¡Hola! Quiero comprar esto: ${PPE.title.textContent}`
  window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
}

//Templates
const Templates = document.querySelector('.templates')
const tmpProduct = Templates.querySelector('template').content

function insertItems(array, config = null) {
  let init = config?.init || 0
  let len = config?.offset

  if (len) len += init
  else len = array.length

  for (let i = init; i < len; i++) {
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
    info.dataset.type = e.type
    im.srcset = e.image
    n.textContent = e.title
    d.textContent = e.info
    p.textContent = "$ " + e.price
    lp.textContent = "$ " + e.price

    moreProducts.appendChild(tmp)
  }
}

const data = await fetch('src/db.json')
const json = await data.json()

insertItems(json)