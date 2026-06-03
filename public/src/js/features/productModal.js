import { catalogContainer, productModal } from '../ui/dom.js'
import Format from './Format.js'
import Notify from './Notify.js'

const { spin, name, image, type, info, stock, lastprice, price, description } = productModal
const { back, fav, share, buy } = productModal.actions
const { menos, mas, input } = productModal.counter

let lastLoaded = 0

catalogContainer.onclick = e => {
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
    name.textContent = i.querySelector('.pdt-name').textContent
    price.textContent = i.querySelector('b').textContent
    lastprice.textContent = i.querySelector('s').textContent
    description.textContent = i.querySelector('.pdt-description').textContent
  } else {
    image.classList.add('visible')
  }

  productModal.root.classList.add('visible')

  const myUrl = `/product/${id}/${Format.parseURL(name.textContent)}`

  if (location.pathname !== myUrl) {
    if (history.state && history.state.esArticulo) {
      history.replaceState({ esArticulo: true }, "", myUrl)
    } else {
      history.pushState({ esArticulo: true }, "", myUrl)
    }
  }
}

productModal.root.onclick = e => {
  const i = e.target
  
  if (i.parentNode.matches('main')) history.back()
  else if (i == menos) {
    if (input.value < 2) input.value = 1
    else input.value--
  } else if (i == mas) {
    if (input.value > 98) input.value = 99
    else input.value++
  }
}

image.onload = ()=> {
  image.classList.add('visible')
  spin.classList.add('hidden')
}

back.onclick = ()=> {
  history.back()
}

fav.onclick = ()=> {
  fav.classList.toggle('active')
}

share.onclick = ()=> {
  Notify.show({
    title: "¡Enlace copiado!",
    text: "Enlace copiado al portapapeles.",
    handler: () => navigator.clipboard.writeText(location.href)
  })
}

buy.onclick = ()=> {
  let message = `¡Hola! Quiero comprar esto: ${location.href}`
  window.open(`https://wa.me/573243571105?text=${encodeURIComponent(message)}`, '_blank')
}

window.onpopstate = ()=> {
  if (location.pathname.includes('/product/')) {
    productModal.root.classList.add('visible')
    // TODO: if (lastLoaded === 0) cargarUnicoProducto(id)
  }
  else productModal.root.classList.remove('visible')
}