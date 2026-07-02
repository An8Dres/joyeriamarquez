import express from 'express'
import compression from 'compression'
import navRouter from './routes/nav.js'
import apiRouter from './routes/api.js'
import { getRecent, getPopular } from './utils/initLoad.js'

const app = express()
const port = 5500

app.use(compression())

app.use(express.json())
app.use(express.static('public', { etag: true }))

app.use(navRouter)
app.use('/api', apiRouter)

app.set('view engine', 'ejs')
app.set('views', './server/views')

let cache = null

app.get('/', async (req, res) => {
  if (!cache) cache = {
    __proto__: null,
    popularCards: await getPopular(),
    recentCards: await getRecent()
  }
  res.render('index', cache)
})

// app.get('/product/:id/:slug', async (req, res) => {
//   const PRODUCTO = (await sql`SELECT * FROM productos WHERE id = ${req.params.id}`)[0]
//   PRODUCTO.ogImage = `https://napoleonejoyas.co/cdn/shop/files/${PRODUCTO.main_image_id}_x533.jpg` //CDN
//   PRODUCTO.main_image_id = createBaseImageURL(PRODUCTO.main_image_id)
//   PRODUCTO.precio = Format.formatNumber(PRODUCTO.precio)
//   PRODUCTO.precio_anterior = Format.formatNumber(PRODUCTO.precio_anterior)
//   res.render('producto', { PRODUCTO })
// })

app.listen(port, () => {
  console.log("Servidor escuchando en puerto", port)
})