import { navSelect, cartCounter, mainSection } from './ui/dom.js'

let lastAnchor = navSelect

const acciones = {
  __proto__: null,
  manejarNav,
  closeNotify: ['/features/Notify', 'close'],
  // navigate:    ['/services/router', 'navigate'],
  navigate:    ['.', 'manejarNav'],
  page:        ['/services/router', 'navigate'],
  show:        ['/services/router', 'navigate', { view: 'modal' }],
  back:        ['/features/product', 'atras'],
  share:       ['/features/product', 'compartir'],
  like:        ['/features/product', 'manejarLike'],
  increment:   ['/features/product', 'manejarContador'],
  decrement:   ['/features/product', 'manejarContador'],
  whatsapp:    ['/features/product', 'contactarWhatsapp'],
  add:         ['/features/product', 'guardarEnCarrito'],
}

function manejarNav(anchor) {
  delete anchor.dataset.loading

  if (anchor !== lastAnchor) {
    if (lastAnchor) lastAnchor.classList.remove('selected')
  
    anchor.classList.add('selected')
    lastAnchor = anchor
  }

  ejecutar('page', anchor)
}

function ejecutar(nombreAccion, target) {
  if (target.dataset.loading) return

  const config = acciones[nombreAccion]

  if (config) {
    target.dataset.loading = "true"
    if (config[0] === '.') {
      acciones[config[1]](target)
      return
    }

    import(`/js${config[0]}.js`)
      .then(m => m[config[1]](target, config[2]))
      .finally(() => delete target.dataset.loading)
  }
}

document.onclick = e => {
  const click = e.target.dataset.click

  if (click) {
    ejecutar(click, e.target)
    return
  }

  const accionTarget = e.target.closest('[data-action]')

  if (accionTarget) {
    e.preventDefault()
    ejecutar(accionTarget.dataset.action, accionTarget)
  }
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const imgs = mainSection.querySelectorAll('.product-card img')
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i]
      if (img.complete) img.style.opacity = '1'
    }

    document.onreadystatechange = null
  }
}

document.addEventListener('DOMContentLoaded', async ()=> {
  cartCounter.textContent = localStorage.getItem('cart') || 0
  import('./services/router.js').then(m => m.init())
})

mainSection.addEventListener('load', e => {
  if (e.target.parentNode.classList.contains('pdt-image')) e.target.style.opacity = '1'
}, true)
