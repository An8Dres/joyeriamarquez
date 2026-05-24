import { insertarProductos, cargarProductos } from './pages/home.js'

history.scrollRestoration = 'manual'

insertarProductos(await cargarProductos())