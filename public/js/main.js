import { init } from './features/catalog.js'
import './features/popular.js'
import { mainNav } from './ui/dom.js'

let lastAnchor = mainNav.querySelector('.selected')

mainNav.onclick = e => {
  const i = e.target.closest('a')
  if (!i || lastAnchor === i) return

  lastAnchor.classList.remove('selected')
  i.classList.add('selected')
  lastAnchor = i
}

document.addEventListener('DOMContentLoaded', async ()=> {
  init()
  const Router = (await import ('./services/Router.js')).default
  Router.init()
})