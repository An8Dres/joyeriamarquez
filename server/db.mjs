import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config()

const sql = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 5
})

try {
  const result = await sql`SELECT NOW()`
  if (result[0]) console.log("DB funcionando a la perfección.")
  else console.warn("Algo falló en la conexión a la DB.")
} catch (err) {
  console.error("Error al conectar a la base de datos:", err.code)
}

export default sql