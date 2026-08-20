import sql from './db.js'
import Format from './Format.js'
import { tplNuevos, tplPopulares } from '../../public/js/features/home.js'

export async function getRecent() {
  const data = await sql`SELECT * FROM productos ORDER BY id LIMIT 30`
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

async function fillDB() {
  const [{ count }] = await sql`SELECT COUNT(*) FROM productos`

  if (count == 0) {
    const { readFile } = await import('fs/promises')
    const file = await readFile(process.cwd() + '/server/utils/db.json', 'utf8')
    const productos = JSON.parse(file)

    for (const p of productos) {
      await sql`INSERT INTO productos (
        titulo, info, main_image_id, precio, precio_anterior, tipo, stock
      ) VALUES (
        ${p.titulo}, ${p.info}, ${p.main_image_id}, ${p.precio}, ${p.precio_anterior}, ${p.tipo}, ${p.stock}
      )`
    }
  }
}