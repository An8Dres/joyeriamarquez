import sql from './db.mjs'
import Format from './Format.mjs'

function createBaseImageURL(id) {
  const IMG_SIZES = ['165', '360', '533', '720', '940']
  let url = ""
  for (let i = 0; i < IMG_SIZES.length; i++) {
    const SIZE = IMG_SIZES[i]
    url += `https://napoleonejoyas.co/cdn/shop/files/${id}_x${SIZE}.jpg ${SIZE}w, ` // CDN/image.jpg
  }
  return url.substring(0, url.length - 2)
}

export async function getPopular() {
  const productos = await sql`SELECT * FROM productos ORDER BY stock LIMIT 10`

  const len = productos.length
  if (len === 0) return

  let htmlBuffer = ''

  for (let i = 0; i < len; i++) {
    const prod = productos[i]
    htmlBuffer += `
      <article class="product" data-id="${prod.id}">
        <div class="pdt-image">
          <span class="pdt-target">Más vendido</span>
          <img sizes="300px" alt="producto" loading="lazy" srcset="${createBaseImageURL(prod.main_image_id)}">
        </div>
        <div class="pdt-info" data-type="${prod.tipo}" data-stock="${prod.stock}">
          <span class="pdt-name">${prod.titulo}</span>
          <span class="pdt-description">${prod.info}</span>
        <span class="pdt-price"><b>${Format.formatNumber(prod.precio)}</b><s>${Format.formatNumber(prod.precio_anterior)}</s></span>
        </div>
      </article>
    `
  }

  return htmlBuffer
}