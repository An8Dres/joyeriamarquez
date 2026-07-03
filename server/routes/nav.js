import { Router } from "express"
import sql from '../utils/db.js'
import Format from '../utils/Format.js'

const navRouter = new Router()

navRouter.get('/:slug', (req, res) => res.redirect('/'))

navRouter.get('/product/:id/:slug', async (req, res) => {
  try {
    const PRODUCT = (await sql`SELECT * FROM productos WHERE id = ${req.params.id}`)[0]
    
    const data = {
      __proto__: null,
      ogImage: `https://napoleonejoyas.co/cdn/shop/files/${PRODUCT.main_image_id}_x533.jpg`, //CDN
      product: null
    }

    PRODUCT.main_image_id = Format.createBaseImageURL(PRODUCT.main_image_id)
    PRODUCT.precio = Format.formatNumber(PRODUCT.precio)
    PRODUCT.precio_anterior = Format.formatNumber(PRODUCT.precio_anterior)

    data.product = PRODUCT

    res.render('product', { data })
  } catch (err) {
    console.error('ERROR:', err.message)
    res.sendStatus(500)
  }
})

export default navRouter
