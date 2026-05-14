import { products } from '../dom.js'
import { getTemplate } from './TemplateLoader.js'

export let allPdts = []
const initialProductCount = 15
let nowIndex = 0
let isLoading = false

export function initLoad() {
  function loadOnScroll() {
    const { scrollTop, scrollHeight, clientHeight } = products
    if (scrollTop + clientHeight >= scrollHeight - 100) loadMoreProducts()
  }

  fetch('/products', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      allPdts = data
      loadMoreProducts()
      products.addEventListener('scroll', loadOnScroll)
    })

  // fetch('/carrito', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ ids: carrito })
  //     })
  //     .then(res => res.json())
  //     .then(productos => {
  //         console.log(productos)
  //         // Aquí renderizas los productos
  //     })
}

async function loadMoreProducts() {
  if (isLoading) return
  isLoading = true
  // loader.querySelector('.loading').classList.remove('disabled')

  const final = nowIndex + initialProductCount
  const items = allPdts.slice(nowIndex, final)
  const tpl = await getTemplate('products')

  // loader.remove()

  items.forEach(art => {
    const clon = tpl.cloneNode(true)

    clon.querySelector('a').href = art.slug
    clon.querySelector('a').dataset.id = art.id
    clon.querySelector('source').srcset = `src/pdts/avif/front/${art.id}.avif`
    clon.querySelector('img').src = `src/pdts/webp/front/${art.id}.webp`
    clon.querySelector('.name').textContent = art.name
    clon.querySelector('.price').textContent = art.price

    products.appendChild(clon)
  })

  // products.appendChild(loader)
  // loader.querySelector('.loading').classList.add('disabled')

  nowIndex += items.length
  isLoading = false
}