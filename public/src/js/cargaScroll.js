import { cargarProductos, insertarProductos } from "./main.js"
let activo = true
let offset = 0

window.onscroll = async e => {
  const h = document.body.scrollHeight
  const d = window.scrollY

  if (activo && d > h * 0.6 && offset < 50) {
    activo = false
    offset += 10
    insertarProductos(await cargarProductos(offset))
    activo = true
  }
}
 const hola = ""
 export default hola