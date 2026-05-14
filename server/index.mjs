import express from 'express'
import pool from './db.mjs'
// import Products from './Products.mjs'
// import { filtrarCompartidos } from './productsShared.mjs'

const app = express()
const port = 5500 //

app.use(express.static('public'))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', './views')

// app.get('/', (req, res) => {
//   const result = Products.initLoad()
//   res.render('index', { result })
// })

//CARGAR ARTICULOS
// import fs from 'node:fs'
// const ARTICULOS = JSON.parse(fs.readFileSync(process.cwd() + '/server/db.json', 'utf-8'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html')
})

app.get('/product/:slug', (req, res) => {
  // const id = req.query.id
  // const product = ARTICULOS.find(a => a.id === id)

  res.sendFile(process.cwd() +'/public/src/html/articulo.html')
  // res.render('articulo', { product })
})

app.get('/:slug', (req, res) => {
  const slug = req.params.slug

  switch (slug) {
    case 'product': {
      res.sendFile(process.cwd() +'/public/index.html')
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
      res.send(slug)
      // const product = Products.get().find(p => p.slug === slug)
      // if (!product) return res.status(404).sendFile(process.cwd() + '/public/html/notFound.html')
      // res.render('product', { product })
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