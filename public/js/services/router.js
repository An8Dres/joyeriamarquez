import { mainSection, mainPage, progressBar } from '../ui/dom.js'
import { Notify } from '/js/features/Notify.js'

const cache = new Map()
const cssCache = new Set()

let lastElement = null

function getEndpoint(url) { 
  const endpoint = URL.parse(url || location.href).pathname
  if (endpoint === '/') return '/home' //Default module
  if (endpoint.includes('/product/')) return '/product'
  return endpoint
}

function renderNotFound() {
  Notify.show({
    title: 'Error 404',
    text: 'No se encontró la página.',
    type: 2
  })
}

async function loadCSS(name) {
  if (cssCache.has(name)) return Promise.resolve()

  const res = await fetch(`/css${name}.css`, { method: 'HEAD' })
  if (!res.ok) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `/css${name}.css`
    document.head.appendChild(link)

    cssCache.add(name)

    link.onload = () => {
      resolve()
      link.onload = null
    }

    link.onerror = () => {
      console.warn('No se encontró el CSS')
      reject()
      link.onerror = null
      link.remove()
    }
  })
}

export async function init() {
  const endpoint = getEndpoint()
  const Module = await import(`/js/features${endpoint}.js`)
  Module.init()

  if (history.state) {
    history.state.view = 'page'
    history.replaceState(history.state, null, location.href)
  } else {
    history.replaceState({ isLastState: true, view: 'page' }, null, location.href)
  }

  const config = {
    __proto__: null,
    element: mainPage,
    lastVisited: location.pathname.substring(0, location.pathname.lastIndexOf('/')) || '/'
  }

  cssCache.add(endpoint)
  cache.set(endpoint, config)

  lastElement = mainPage

  window.onpopstate = e => navigate({ href: location.href }, e.state)
}

export async function navigate(anchor, options = null) {
  const url = anchor.href
  const endpoint = getEndpoint(url)
  const pathname = URL.parse(url).pathname
  const pathcut = pathname.substring(0, pathname.lastIndexOf('/')) || '/'

  let time = setTimeout(() => {
    document.body.classList.add('waiting')
    progressBar.classList.add('loading')
  }, 150)

  const Module = (await Promise.all([
    import(`/js/features${endpoint}.js`), loadCSS(endpoint)
  ]).catch(() => {
    clearTimeout(time)
    document.body.classList.remove('waiting')
    progressBar.classList.remove('loading', 'loaded')
    renderNotFound()
  }))[0]

  const config = cache.get(endpoint)

  if (url !== location.href) history.pushState(options, null, url)
  
  if (config?.element) {
    if (config.lastVisited !== pathcut) await Module.update(anchor)
    clearTimeout(time)
    document.body.classList.remove('waiting')
    progressBar.classList.remove('loading', 'loaded')
      
    if (options?.view === 'modal') {
      config.element.classList.add('modal')
    } else {
      config.element.classList.remove('modal')
      lastElement.classList.remove('visible')
    }
    
    config.element.classList.add('visible')

    lastElement = config.element
    config.lastVisited = pathcut
    return
  }

  if (options?.view !== 'modal') lastElement.classList.remove('visible')

  mainSection.insertAdjacentHTML('beforeend', Module.template(options))
  await Module.init(options)
  await Module.update(anchor)

  let element = mainSection.lastElementChild
  element.classList.add('visible')
  lastElement = element

  cache.set(endpoint, { element, lastVisited: pathcut })

  progressBar.classList.add('loaded')
  setTimeout(() => progressBar.classList.remove('loaded', 'loading'), 100)

  clearTimeout(time)
  document.body.classList.remove('waiting')
}