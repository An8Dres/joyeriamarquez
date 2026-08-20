import { Router } from "express"
import sql from '../utils/db.js'
import Format from '../utils/Format.js'
import {template as tplCart} from '../../public/js/features/cart.js'

const navRouter = new Router()

async function loadProduct(req, res) {
  try {
    const result = await sql`SELECT * FROM productos WHERE id = ${req.params.id}`
    const idImage = result[0].main_image_id
    const product = Format.productParser(result)[0]

    if (req.originalUrl !== product.href) return res.redirect(product.href)
    
    const data = {
      __proto__: null,
      ogImage: `https://napoleonejoyas.co/cdn/shop/files/${idImage}_x533.jpg`, //CDN
      product
    }

    res.render('product', data)
  } catch (err) {
    console.error(err.message)
    res.sendStatus(500)
  }
}

navRouter.get('/:slug', async (req, res) => {
  if (req.params.slug === 'cart') {
    const template = tplCart()
    res.render('template', { template })
  }else res.sendStatus(404)
})

navRouter.get('/product/:id', loadProduct)
navRouter.get('/product/:id/:slug', loadProduct)

export default navRouter
