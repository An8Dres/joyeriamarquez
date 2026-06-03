export const mainSection = document.querySelector('.main-section')
export const mainHeader = mainSection.querySelector('header')
export const catalogContainer = document.querySelector('.catalog__container')
export const popularContainer = document.querySelector('#popular-card__container')
export const recentContainer = document.querySelector('#main-card__container').querySelector('div')
export const notifyElement = document.querySelector('.notify')

const modalRoot = document.getElementById('product-modal')

export const productModal = {
  __proto__: null,
  root: modalRoot,
  spin: modalRoot.querySelector('.spin'),
  name: modalRoot.querySelector('h2'),
  image: modalRoot.querySelector('img'),
  price: modalRoot.querySelector('.price'),
  lastprice: modalRoot.querySelector('.lastprice'),
  stock: modalRoot.querySelector('.product-modal-stock'),
  type: modalRoot.querySelector('.product-modal-type span'),
  description: modalRoot.querySelector('.product-modal-description'),

  actions: {
    back: modalRoot.querySelector('#btn-back'),
    fav: modalRoot.querySelector('#btn-fav'),
    share: modalRoot.querySelector('#btn-share'),
    buy: modalRoot.querySelector('#btn-buy')
  },

  counter: {
    input: modalRoot.querySelector('#input-cantidad'),
    menos: modalRoot.querySelector('#btn-menos'),
    mas: modalRoot.querySelector('#btn-mas')
  }
}