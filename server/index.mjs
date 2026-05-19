import express from 'express'
import sql from './db.mjs'

import data from './Productos.mjs'
import Format from './Format.mjs'

const app = express()
const port = 5500 //

app.use(express.static('public'))
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

app.get('/product/:id/:slug', (req, res) => {
  const product = data[req.params.id - 1]
  product.ogImage = product.image.split(' 533w')[0].split(' 360w')[1].slice(1)
  res.render('articulo', { product })
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

app.post('/bag-items', (req, res) => {
  const ids = req.body.ids
  const filters = Products.get().filter(p => ids.includes(p.id))
  res.json(filters)
})

app.post('/refresh-products', () => {
  Products.refresh()
})

app.listen(port, () => {
  console.log("Server listen on port", port)
})


import fs from 'node:fs'
const ARTICULOS = JSON.parse(fs.readFileSync(process.cwd() + '/server/db.json', 'utf-8'))

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

//Formato colombiano
async function agregarTodos() {
  for (const a of ARTICULOS) {
    const query = await sql`INSERT INTO productos (titulo, info, imagen_src, precio, precio_anterior, tipo, stock) VALUES
    (${a.title}, ${a.info}, ${a.image}, ${Format.parseNumber(a.price)}, ${Format.parseNumber(a.price) + 20000}, ${a.type}, ${(Math.random() * 100) | 0});`
  }
}

agregarTodos()