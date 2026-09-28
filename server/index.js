import express from 'express'
import compression from 'compression'
import navRouter from './routes/nav.js'
import apiRouter from './routes/api.js'

import { home } from './utils/init.js'

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
    name: 'home',
    template: await home()
  }
  res.render('template', cache)
})

app.listen(port, () => {
  console.log("Servidor escuchando en puerto", port)
})