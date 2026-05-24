const header = document.querySelector('header')
const page = document.querySelector('.page')
const mainProductContainer = document.querySelector('.main-product__container')
const productPageModal = document.getElementById('product-page')
const templates = document.querySelector('.templates')
const tmpProduct = templates.querySelector('template').content
const notifyElement = document.querySelector('.notify')

//Product Page Modal Elements
const PME = {
  __proto__: null,
  spin: productPageModal.querySelector('.spin'),
  title: productPageModal.querySelector('h2'),
  image: productPageModal.querySelector('img'),
  price: productPageModal.querySelector('.price'),
  lastprice: productPageModal.querySelector('.lastprice'),
  stock: productPageModal.querySelector('.product-page-stock'),
  type: productPageModal.querySelector('.product-page-type span'),
  description: productPageModal.querySelector('.product-page-description'),
  btnBack: productPageModal.querySelector('#btn-back'),
  btnFav: productPageModal.querySelector('#btn-fav'),
  btnShare: productPageModal.querySelector('#btn-share'),
  btnBuy: productPageModal.querySelector('#btn-buy'),
  inputCantidad: productPageModal.querySelector('#input-cantidad'),
  btnMenos: productPageModal.querySelector('#btn-menos'),
  btnMas: productPageModal.querySelector('#btn-mas')
}

export {
  header, page, mainProductContainer, productPageModal,
  PME, templates, tmpProduct, notifyElement
}