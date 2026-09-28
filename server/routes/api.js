import { Router } from 'express'
import sql from '../utils/db.js'

const apiRouter = Router()

apiRouter.post('/products/:type', async (req, res) => {
  try {
    let productos

    const { id } = req.body

    switch (req.params.type) {
      case 'id':
        productos = await sql`SELECT * FROM productos WHERE id=${id}`
      break
      case 'recent':
        productos = await sql`SELECT * FROM productos WHERE id > ${id} LIMIT 20` //ORDER BY id ASC
      break

      case 'popular':
        productos = await sql`SELECT * FROM productos WHERE id > ${id} ORDER BY stock LIMIT 10`
      break
      default:
        return res.sendStatus(404)
    }

    res.status(200).json(productos)
  } catch (err) {
    console.error('ERROR:', err.message)
    res.sendStatus(500)
  }
})

apiRouter.post('/cart', async (req, res) => {
  try {
    const ids = req.body

    let productos = await sql`SELECT id, nombre, main_image_id, precio, stock FROM productos WHERE id = ANY(${ids})`

    res.status(200).json(productos)
  } catch (err) {
    console.error('ERROR:', err.message)
    res.sendStatus(500)
  }
})

export default apiRouter
