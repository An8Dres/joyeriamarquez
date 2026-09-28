import sql from './db.js'
import { templates } from '../../public/js/features/home.js'

export async function home() {
  const recientes = await sql`SELECT * FROM productos ORDER BY id LIMIT 30`
  const populares = await sql`SELECT * FROM productos ORDER BY stock LIMIT 10`
  
  const tpl = templates.main({ visible: true })

  tpl[1] = templates.populares(populares)
  tpl[3] = templates.nuevos(recientes)
  
  return tpl.join("")
}

async function fillDB() {
  const [{ count }] = await sql`SELECT COUNT(*) FROM productos`

  if (count == 0) {
    const { readFile } = await import('fs/promises')
    const file = await readFile(process.cwd() + '/server/utils/db.json', 'utf8')
    const productos = JSON.parse(file)

    for (const p of productos) {
      await sql`INSERT INTO productos (
        nombre, descripcion, main_image_id, precio, precio_anterior, tipo, stock
      ) VALUES (
        ${p.nombre}, ${p.descripcion}, ${p.main_image_id}, ${p.precio}, ${p.precio_anterior}, ${p.tipo}, ${p.stock}
      )`
    }
  }
}