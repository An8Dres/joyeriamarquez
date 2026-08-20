import { Router } from 'express'
import sql from '../utils/db.js'
import Format from '../utils/Format.js'

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

    res.status(200).json(Format.productParser(productos))
  } catch (err) {
    console.error('ERROR:', err.message)
    res.sendStatus(500)
  }
})

apiRouter.put('/update/:type', async (req, res) => {
  switch (req.params.type) {
    case 'stock':
      const { id, stock } = req.body
      const data = await sql`UPDATE productos SET stock = ${stock} WHERE id = ${id}`
      data.length ? res.sendStatus(404) : res.sendStatus(204) 
    break
    default:
      res.sendStatus(404)
  }
  
})

export default apiRouter
