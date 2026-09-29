import express from 'express'
import compression from 'compression'
import basicAuth from 'express-basic-auth'

import navRouter from './routes/nav.js'
import apiRouter from './routes/api.js'

import { home } from './utils/init.js'

const app = express()

const port = 5500

app.use(compression())

// Permite recibir JSON desde fetch()
app.use(express.json())

// Permite recibir formularios tradicionales
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public', { etag: true }))

const adminAuth = basicAuth({
    users: { 'admin': process.env.ADMIN_PASSWORD }, 
    challenge: true,
    unauthorizedResponse: 'Acceso denegado al panel administrativo.'
})

app.use('/admin', adminAuth)

app.use(navRouter)

app.use('/api', apiRouter)


app.set('view engine', 'ejs')

app.set('views', './server/views')


app.get('/', async (req, res) => {
    const cache = {
        __proto__: null,
        name: 'home',
        template: await home(),
        ogImage: "https://an8dres.github.io/joyeriamarquez/iconos/preview.png",
        descripcion: "Descubre joyería fina hecha a mano. Anillos de compromiso, collares y pulseras en oro y plata. Diseños únicos para momentos inolvidables. Compra online."
    }

    res.render('template', cache)
})


app.listen(port, () => {
    console.log(
        "Servidor escuchando en puerto",
        port
    )
})