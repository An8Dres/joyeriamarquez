const routes = ['/', '/cart', '/profile'] // All endpoints
const cache = new Array(3)

history.scrollRestoration = 'manual'

function changeState(e) {
  const a = e.target.closest('a')
  if (!a) return
  e.preventDefault()

  const URL = a.href
  if (URL.includes('/product/')) return

  if (location.pathname !== URL) history.pushState(null, null, URL)
  else history.replaceState(null, null, URL)

  loadViews()
}

async function loadViews() {
  let url = location.pathname

  //DINAMIC AND STATIC PATHS
  // if (url.includes('/product')) url = '/product'
  if (!routes.includes(url)) return

  //MODULE OF MAIN PATH
  if (url === '/') url = '/catalog'

  const mod = await import(`../features${url}.js`)
  mod.init()
}

export function init() {
  loadViews()
  document.addEventListener('click', changeState)
  window.addEventListener('popstate', loadViews)
}