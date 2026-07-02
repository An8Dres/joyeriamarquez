import sql from './db.js'
import Format from './Format.js'
import { tplNuevos, tplPopulares } from '../../public/js/features/catalog.js'

export async function getRecent() {
  const data = await sql`SELECT * FROM productos ORDER BY id LIMIT 20`
  if (data.length === 0) return null
  Format.productParser(data)
  return tplNuevos(data)
}

export async function getPopular() {
  const data = await sql`SELECT * FROM productos ORDER BY stock LIMIT 10`
  if (data.length === 0) return null
  Format.productParser(data)
  return tplPopulares(data)
}