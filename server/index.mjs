import express from 'express'
import Format from './Format.mjs'
import sql from './db.mjs'

const app = express()
const port = 5500

app.use(express.static('public'))
app.use(express.text())
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', './server/views')

// app.get('/', (req, res) => {
//   const result = Products.initLoad()
//   res.render('index', { result })
// })

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get('/product/:id/:slug', async (req, res) => {
  const PRODUCTO = (await sql`SELECT * FROM productos WHERE id = ${req.params.id}`)[0]
  PRODUCTO.ogImage = `https://napoleonejoyas.co/cdn/shop/files/${PRODUCTO.main_image_id}_x533.jpg` //CDN
  PRODUCTO.main_image_id = createBaseImageURL(PRODUCTO.main_image_id)
  PRODUCTO.precio = Format.formatNumber(PRODUCTO.precio)
  PRODUCTO.precio_anterior = Format.formatNumber(PRODUCTO.precio_anterior)
  res.render('producto', { PRODUCTO })
})

app.get('/:slug', (req, res) => {
  const slug = req.params.slug

  switch (slug) {
    case 'product': {
      res.sendFile(process.cwd() + '/public/index.html')
    }
    case 'order': {
      //TODO: arreglar el que pasen el mismo producto de nuevo por la URL (Se muestra separado y no contado en un solo item) order?t=3,1,3 -> order?t=3:2,1
      // const { t } = req.query
      // const arrIds = t ? t.split(',') : []
      // const arrCantities = arrIds.map(parDeDatos => parDeDatos.split(':')[1])
      // const orderProducts = arrIds.map((id, i) => ({
      //   id: id.split(':')[0],
      //   cant: arrCantities[i] || 1
      // }))
      // const info = filtrarCompartidos(orderProducts)
      // res.render('productsShared', { info })
    }
      break
    case 'makeup':
      const result = Products.initLoad('makeup')
      res.render('makeup', { result })
      break
    case 'accessories':
      res.render('accessories')
    case 'bag':
      res.sendFile(process.cwd() + '/public/html/bag.html')
      break
    default:
      res.redirect('/')
    // return res.status(404).sendFile(process.cwd() + '/public/html/notFound.html')
  }
})

app.post('/productos', async (req, res) => {
  res.send(await getProductos(req.body))
})

app.post('/bag-items', (req, res) => {
  const ids = req.body.ids
  const filters = Products.get().filter(p => ids.includes(p.id))
  res.json(filters)
})

app.listen(port, () => {
  console.log("Server listen on port", port)
})

function parserURL(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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

async function getProductos(offset = 0) {
  const productos = await sql`SELECT * FROM productos LIMIT 20 OFFSET ${offset}`
  for (let i = 0; i < productos.length; i++) {
    const p = productos[i]
    p.main_image_id = createBaseImageURL(p.main_image_id)
    p.precio = Format.formatNumber(p.precio)
    p.precio_anterior = Format.formatNumber(p.precio_anterior)
  }
  return productos;
}

//Formato colombiano | Agrega productos de JSON a la DB
async function fillDB() {
  for (const a of ARTICULOS) {
    let imageName = a.image.split('_165x')[0].slice(35).trim()
    const query = await sql`INSERT INTO productos (titulo, info, main_image_id, precio, precio_anterior, tipo, stock) VALUES
    (${a.title}, ${a.info}, ${imageName}, ${Format.parseNumber(a.price)}, ${Format.parseNumber(a.price) + 20000}, ${a.type}, ${(Math.random() * 100) | 0});`
  }
}