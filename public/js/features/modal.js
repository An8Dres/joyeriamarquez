import { catalogContainer, mainSection, cartCounter } from '../ui/dom.js'

let productModal = null
let cssIsLoaded = false
let lastLoaded = 0

function loadCSS() {
  if (cssIsLoaded) return
  const link = document.createElement('link')
  link.href = '/css/modal.css'
  link.rel = 'stylesheet'
  link.onclick = ()=> {
    productModal.root.removeAttribute('hidden')
    link.onclick = null
  }
  document.head.appendChild(link)
  cssIsLoaded = true
}

export async function init() {
  const modalRoot = document.getElementById('product-modal')

  productModal = {
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
    //actions
    back: modalRoot.querySelector('#btn-back'),
    fav: modalRoot.querySelector('#btn-fav'),
    share: modalRoot.querySelector('#btn-share'),
    save: modalRoot.querySelector('#btn-add'),
    buy: modalRoot.querySelector('#btn-buy'),
    //picker
    input: modalRoot.querySelector('#input-cantidad'),
    menos: modalRoot.querySelector('#btn-menos'),
    mas: modalRoot.querySelector('#btn-mas')
  }

  loadCSS()

  const { Notify } = await import('./Notify.js')

  productModal.root.onclick = e => {
    let i = e.target
    if (i.parentNode.matches('main')) history.back()

    const isButton = i.closest('button')
    if (isButton) i = isButton

    const { menos, mas, input, fav, share, buy, save, back } = productModal

    //QuantityPicker
    if (i === mas) input.stepUp()
    else if (i === menos) input.stepDown()

    //Actions
    if (i === back) history.back()
    else if (i === fav) fav.classList.toggle('active')
    else if (i === share) {
      Notify.show({
        title: "¡Enlace copiado!",
        text: "Enlace copiado al portapapeles.",
        handler: () => navigator.clipboard.writeText(location.href)
      })
    } else if (i === buy) {
      let message = `¡Hola! Quiero comprar esto: ${location.href}`
      window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
    } else if (i === save) {
      let value = +cartCounter.textContent + (+input.value)
      localStorage.setItem('cart', value)
      cartCounter.textContent = value > 99 ? '+99' : value
    }
  }

  productModal.input.onkeydown = e => {
    if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === ' ') e.preventDefault()
  }

  productModal.input.onblur = () => {
    const { input } = productModal
    let val = +input.value

    if (isNaN(val) || input.value === '') {
      input.value = 1
      return
    }

    input.value = Math.max(1, Math.min(99, val))
  }
  //Router
  window.addEventListener('popstate', ()=> {
    if (location.pathname.startsWith('/product/')) {
      productModal.root.classList.add('visible')
      // TODO: if (lastLoaded === 0) cargarUnicoProducto(id)
    }
    else productModal.root.classList.remove('visible')
  })
}

export function show(card) {
  const id = card.dataset.id

  if (id  !== lastLoaded) {
    lastLoaded = id

    //READ
    const imgSrcset = card.querySelector('img').srcset
    const pdtInfo = card.querySelector('.pdt-info').dataset
    const pdtName = card.querySelector('.pdt-name').textContent
    const pdtPrice = card.querySelector('b').textContent
    const pdtLastPrice = card.querySelector('s').textContent
    const pdtDescription = card.querySelector('.pdt-description').textContent

    //WRITE
    productModal.image.srcset = ''
    productModal.image.classList.remove('visible')
    productModal.spin.classList.remove('hidden')

    const tempImg = new Image()
    tempImg.srcset = imgSrcset

    tempImg.decode().then(() => {
      productModal.image.srcset = tempImg.srcset
      productModal.spin.classList.add('hidden')
      productModal.image.classList.add('visible')
    })
    // .catch(() => image.srcset = imgSrcset)
    
    productModal.type.textContent = pdtInfo.type
    productModal.stock.textContent = `Stock ${pdtInfo.stock}`
    productModal.name.textContent = pdtName
    productModal.price.textContent = pdtPrice
    productModal.lastprice.textContent = pdtLastPrice
    productModal.description.textContent = pdtDescription
  }

  productModal.root.classList.add('visible')

  if (location.pathname !== card.href) history.pushState(null, null, card.href)
  else history.replaceState(null, null, card.href)
}