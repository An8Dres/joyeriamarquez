import express from 'express'
import sql from './utils/db.mjs'
import Format from './utils/Format.mjs'
import { getPopular } from './utils/initLoad.mjs'

const app = express()
const port = 5500

app.use(express.static('public', { etag: true }))
app.use(express.text())
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', './server/views')

let cache = null

app.get('/', async (req, res) => {
  if (!cache) cache = await getPopular()
  const INIT = cache
  res.render('index', { INIT })
})

app.get('/product/:id/:slug', async (req, res) => {
  const PRODUCTO = (await sql`SELECT * FROM productos WHERE id = ${req.params.id}`)[0]
  PRODUCTO.ogImage = `https://napoleonejoyas.co/cdn/shop/files/${PRODUCTO.main_image_id}_x533.jpg` //CDN
  PRODUCTO.main_image_id = createBaseImageURL(PRODUCTO.main_image_id)
  PRODUCTO.precio = Format.formatNumber(PRODUCTO.precio)
  PRODUCTO.precio_anterior = Format.formatNumber(PRODUCTO.precio_anterior)
  res.render('producto', { PRODUCTO })
})

app.post('/api/products/:type', async (req, res) => {
  let productos

  const offset = req.body.offset

  switch (req.params.type) {
    case 'recent':
      productos = await sql`SELECT * FROM productos LIMIT 20 OFFSET ${offset}`
    break

    case 'popular':
      productos = await sql`SELECT * FROM productos ORDER BY stock LIMIT 10 OFFSET ${offset}`
    break
    default:
      return res.sendStatus(404)
  }

  res.send(productParser(productos))
})

app.post('/update-stock', async (req, res) => {
  const { id, stock } = req.body
  const data = await sql`UPDATE productos SET stock = ${stock} WHERE id = ${id}`
  data.length ? res.sendStatus(404) : res.sendStatus(204) 
})

app.listen(port, () => {
  console.log("Server listen on port", port)
})

function productParser(array) {
  for (let i = 0; i < array.length; i++) {
    const p = array[i]
    p.main_image_id = createBaseImageURL(p.main_image_id)
    p.precio = Format.formatNumber(p.precio)
    p.precio_anterior = Format.formatNumber(p.precio_anterior)
  }
  return array
}

function createBaseImageURL(id) {
  const IMG_SIZES = ['165', '360', '533', '720', '940']
  let url = ""
  for (let i = 0; i < IMG_SIZES.length; i++) {
    const SIZE = IMG_SIZES[i]
    url += `//napoleonejoyas.co/cdn/shop/files/${id}_x${SIZE}.jpg ${SIZE}w, ` // CDN/image.jpg
  }
  return url.substring(0, url.length - 2)
}

async function fillDB() {
  for (const a of ARTICULOS) {
    let imageName = a.image.split('_165x')[0].slice(35).trim()
    const query = await sql`INSERT INTO productos (titulo, info, main_image_id, precio, precio_anterior, tipo, stock) VALUES
    (${a.title}, ${a.info}, ${imageName}, ${Format.parseNumber(a.price)}, ${Format.parseNumber(a.price) + 20000}, ${a.type}, ${(Math.random() * 100) | 0});`
  }
}