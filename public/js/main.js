let lastAnchor = navSelect

const accionesPropias = {
  manejarNav,
  cerrarNotificacion: () => Notify.close()
}

const acciones = {
  __proto__: null,
  nav:         ['.', 'manejarNav'],
  closeNotify: ['.', 'cerrarNotificacion'],
  navigate:    ['/services/router', 'navigate', { view: 'page'}],
  modal:       ['/services/router', 'navigate', { view: 'modal' }],
  update:      ['/services/router', 'navigate', { update: true }],
  back:        ['/features/product', 'atras'],
  share:       ['/features/product', 'compartir'],
  like:        ['/features/product', 'manejarLike'],
  increment:   ['/features/product', 'manejarContador'],
  decrement:   ['/features/product', 'manejarContador'],
  whatsapp:    ['/features/product', 'contactarWhatsapp'],
  add:         ['/features/cart', 'agregarProducto'],
  remove:      ['/features/cart', 'removerProducto'],
}

function manejarNav(anchor) {
  delete anchor.dataset.loading

  ejecutar('navigate', anchor)

  if (anchor !== lastAnchor) {
    if (lastAnchor) lastAnchor.classList.remove('selected')
  
    anchor.classList.add('selected')
    lastAnchor = anchor
  }
}

function ejecutar(nombreAccion, target) {
  if (target.dataset.loading) return

  const config = acciones[nombreAccion]

  if (config) {
    target.dataset.loading = "true"

    if (config[0] === '.') {
      accionesPropias[config[1]](target)
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

document.addEventListener('DOMContentLoaded', async () => {
  const cartCount = localStorage.getItem('cart-counter')

  if (cartCount) {
    cartCounter.textContent = cartCount
    cartCounter.classList.add('visible')
  }

  const router = await import('./services/router.js')
  router.init()
})

mainSection.addEventListener('load', e => {
  if (e.target.parentNode.classList.contains('pdt-image')) e.target.style.opacity = '1'
}, true)
