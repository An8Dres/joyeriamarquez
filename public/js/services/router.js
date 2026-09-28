let LAST_PAGE = null

const cache = new Map()
const cssCache = new Set()

function getEndpoint(url) { 
  const endpoint = URL.parse(url || location.href).pathname
  if (endpoint === '/') return '/home' //Default module
  if (endpoint.includes('/product/')) return '/product'
  return endpoint
}

function getPathcut(pathname) {
  return pathname.substring(0, pathname.lastIndexOf('/')) || pathname
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

function renderNotFound() {
  Notify.show({
    title: 'Error 404',
    text: 'No se encontró la página.',
    type: 2
  })
}

export async function init() {
  const endpoint = getEndpoint()
  const Module = await import(`/js/features${endpoint}.js`)

  if (history.state) {
    history.state.view = 'page'
    history.replaceState(history.state, null, location.href)
  } else {
    history.replaceState({ isFirstState: true, view: 'page' }, null, location.href)
  }

  Module.init(history.state)

  const config = {
    __proto__: null,
    element: mainPage,
    lastVisited: getPathcut(location.pathname)
  }

  cache.set(endpoint, config)
  cssCache.add(endpoint)

  LAST_PAGE = mainPage

  window.onpopstate = e => navigate({ href: location.href }, e.state)
}

export async function navigate(anchor, options = null) {
  const url = anchor.href
  const endpoint = getEndpoint(url)
  const pathcut = getPathcut(URL.parse(url).pathname)

  let time = setTimeout(() => { loader.classList.add('active') }, 200)

  // await new Promise(resolve => setTimeout(resolve, 1000))

  const Module = (await Promise.all([
    import(`/js/features${endpoint}.js`), loadCSS(endpoint)
  ]).catch(() => {
    clearTimeout(time)
    loader.classList.remove('active')
    renderNotFound()
  }))[0]

  const config = cache.get(endpoint)

  if (url !== location.href) history.pushState(options, null, url)
  
  if (config?.element) {
    if (config.lastVisited !== pathcut || options?.update) {
      config.element.scrollTop = 0 // scroll restoration
      await Module.update(anchor)
    }

    clearTimeout(time)
    loader.classList.remove('active')

    if (options?.view === 'modal') {
      config.element.classList.add('modal')
    } else {
      config.element.classList.remove('modal')
      LAST_PAGE.classList.remove('visible')
    }

    config.element.classList.add('visible')

    LAST_PAGE = config.element
    config.lastVisited = pathcut
    return
  }

  let tpl = Module.templates.main(options)

  if (tpl instanceof Array) tpl = tpl.join("")

  mainSection.insertAdjacentHTML('beforeend', tpl)

  const element = await Module.init(options)

  await Module.update(anchor)

  if (options?.view !== 'modal') LAST_PAGE?.classList.remove('visible')

  cache.set(endpoint, { element, lastVisited: pathcut })

  LAST_PAGE = element

  clearTimeout(time)
  
  requestAnimationFrame(() => requestAnimationFrame(() => {
    element.classList.add('visible')
    loader.classList.remove('active')
  }))
}