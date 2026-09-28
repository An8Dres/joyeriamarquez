import { Router } from "express"
import sql from '../utils/db.js'
import { templates as tplCart } from '../../public/js/features/cart.js'
import { templates as tplProduct } from '../../public/js/features/product.js'

const templates = {
  __proto__: null,
  cart: tplCart.main(),
  profile: 'profile'
}

const navRouter = new Router()

async function loadProduct(req, res) {
  try {
    const result = await sql`SELECT * FROM productos WHERE id = ${req.params.id}`
    const product = result[0]
    const idImage = product.main_image_id

    // if (req.originalUrl !== product.nombre) return res.redirect(product.href)
    
    const data = {
      __proto__: null,
      name: 'product',
      ogImage: `https://napoleonejoyas.co/cdn/shop/files/${idImage}_x533.jpg`, //CDN
      template: tplProduct.main({ visible: true, data: product })
    }

    res.render('template', data)
  } catch (err) {
    console.error(err.message)
    res.sendStatus(500)
  }
}

navRouter.get('/product/:id', loadProduct)
navRouter.get('/product/:id/:slug', loadProduct)

navRouter.get('/:slug', async (req, res) => {
  const page = req.params.slug
  let template = templates[page]

  if (!template) return res.sendStatus(404)
  else res.render('template', { name: 'cart', template })
})

export default navRouter
