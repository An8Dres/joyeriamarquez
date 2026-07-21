import postgres from 'postgres'

const sql = postgres(process.env.DB_URL)

try {
  const result = await sql`SELECT NOW()`
  if (result[0]) console.log("DB funcionando a la perfección.")
  else console.warn("Algo falló en la conexión a la DB.")
} catch (err) {
  console.error("Error al conectar a la base de datos:", err.code)
}

export default sql