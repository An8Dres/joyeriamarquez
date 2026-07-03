import { mainNav, cartCounter } from './ui/dom.js'

//MAIN HEADER
let lastAnchor = mainNav.querySelector('.selected')

mainNav.onclick = e => {
  const i = e.target.closest('a')
  if (!i || lastAnchor === i) return

  lastAnchor.classList.remove('selected')
  i.classList.add('selected')
  lastAnchor = i
}

document.addEventListener('DOMContentLoaded', async ()=> {
  cartCounter.textContent = localStorage.getItem('cart') || 0

  const Router = await import ('./services/Router.js')
  
  Router.init()

  if (location.pathname.includes('/product/')) {
    const Modal = await import('./features/modal.js')
    Modal.init()
  }
})