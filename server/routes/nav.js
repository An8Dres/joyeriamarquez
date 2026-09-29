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

function getPrecio(numero) {
    let texto = numero.toString()
    return texto.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function optimizarImagen(url, ancho) {
  const parametros = `w_${ancho},f_auto,q_auto`
  return url.replace('/upload/', `/upload/${parametros}/`)
}

async function loadProduct(req, res) {
  try {
    const result = await sql`SELECT * FROM productos WHERE id = ${req.params.id}`
    const product = result[0]
    const imageUrl = product.main_image_id

    // if (req.originalUrl !== product.nombre) return res.redirect(product.href)
    
    const data = {
      __proto__: null,
      name: 'product',
      template: tplProduct.main({ visible: true, data: product }),
      ogImage: optimizarImagen(imageUrl, 500), //CDN
      descripcion: `$${getPrecio(product.precio)} - ${product.nombre}`
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

  if (page === 'health') {
    return res.status(200).send('OK')
  } else if (page === 'admin') {
    // return res.sendFile('admin.html', { root: 'public' })
    return res.sendFile(process.cwd() + '/server/views/admin.html')
  }

  if (!template) return res.sendStatus(404)
  else res.render('template', { name: 'cart', template })
})

export default navRouter
