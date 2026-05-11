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
  description: productPage.querySelector('.product-page-description'),
}

moreProducts.onclick = e => {
  const i = e.target.closest('.product')
  if (!i) return
  PPE.image.src = i.querySelector('img').src
  PPE.title.textContent = i.querySelector('.pdt-name').textContent
  PPE.description.textContent = i.querySelector('.pdt-name--extra').textContent
  PPE.price.textContent = i.querySelector('b').textContent
  PPE.lastprice.textContent = i.querySelector('s').textContent
  productPage.classList.add('active')
}


btnBack.onclick = () => productPage.classList.remove('active')
btnFav.onclick = () => btnFav.classList.toggle('active')

productPage.onclick = e => {
  const i = e.target
  if (i == btnMenos) {
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

