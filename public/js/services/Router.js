const routes = ['/cart', '/profile'] // All endpoints
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
  const URL = location.pathname
  if (!routes.includes(URL)) return
  
  const mod = await import(`../features${URL}.js`)
}

const Router = {
  __proto__: null,

  init() {
    document.addEventListener('click', changeState)
    window.addEventListener('popstate', loadViews)
  },
}

export default Router