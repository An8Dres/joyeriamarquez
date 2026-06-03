import { mainSection, popularContainer, recentContainer } from '../ui/dom.js'
import api from '../services/api.js'

let recentOffset = 0
let popularOffset = 0
let isLoading = false

async function cargarRecientes() {
  const productos = await api.productos.getRecientes(popularOffset)
  const len = productos.length

  popularOffset += len

  if (len === 0) return

  let htmlBuffer = ''

  for (let i = 0; i < len; i++) {
    const prod = productos[i]
    htmlBuffer += `
      <article class="product" data-id="${prod.id}">
        <div class="pdt-image">
          <button aria-label="button add to favorites" class="pdt-btn like">
            <svg aria-hidden="true"><use href="#icon-favorite"></use></svg>
          </button>
          <img sizes="360px" alt="producto" loading="lazy" srcset="${prod.main_image_id}">
        </div>
        <div class="pdt-info" data-type="${prod.tipo}" data-stock="${prod.stock}">
          <span class="pdt-name">${prod.titulo}</span>
          <span class="pdt-description">${prod.info}</span>
        <span class="pdt-price"><b>${prod.precio}</b><s>${prod.precio_anterior}</s></span>
        </div>
      </article>
    `
  }

  recentContainer.insertAdjacentHTML('beforeend', htmlBuffer)
}

history.scrollRestoration = 'manual'

mainSection.onscroll = ()=> {
  if (!isLoading && mainSection.scrollTop > mainSection.scrollHeight * 0.6){
    isLoading = true
    cargarRecientes()
    isLoading = false
  }
}

cargarRecientes()