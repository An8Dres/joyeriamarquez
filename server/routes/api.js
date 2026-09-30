import { Router } from 'express'
import multer from 'multer'
import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import sql from '../utils/db.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'joyeriamarquez_productos', // Se creará esta carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'png', 'webp', 'avif'],
  }
})

const upload = multer({ storage: storage })

const apiRouter = Router()

apiRouter.post('/products/:type', async (req, res) => {
    try {
        let productos

        const id = req.body.id

        switch (req.params.type) {
            case 'id':
                productos = await sql`
                    SELECT *
                    FROM productos
                    WHERE id=${id}
                `
            break
            case 'recent':
                productos = await sql`
                    SELECT *
                    FROM productos
                    WHERE id > ${id}
                    LIMIT 20
                `
            break
            case 'popular':
                productos = await sql`
                    SELECT *
                    FROM productos
                    WHERE id > ${id}
                    ORDER BY stock
                    LIMIT 10
                `
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

apiRouter.post('/upload', upload.single('imagen'), async (req, res) => {
    try {
        const { titulo, info, precio, precio_anterior, stock } = req.body
        const imagen = req.file

        if (!titulo || !info || !precio || !precio_anterior || stock === undefined) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios'
            })
        }

        if (!imagen) {
            return res.status(400).json({
                message: 'Debes subir una imagen'
            })
        }

        const precioNumero = Number(precio)
        const precioAnteriorNumero = Number(precio_anterior)
        const stockNumero = Number(stock)

        if (!Number.isFinite(precioNumero) || precioNumero < 0) {
            return res.status(400).json({
                message: 'El precio no es válido'
            })
        }

        if (!Number.isInteger(stockNumero) || stockNumero < 0) {
            return res.status(400).json({
                message: 'El stock no es válido'
            })
        }

        if (!Number.isFinite(precioAnteriorNumero) || precioAnteriorNumero < 0) {
            return res.status(400).json({
                message: 'El precio anterior no es válido'
            })
        }

        const imageUrl = req.file.path
        //const imagePublicId = req.file.filename // Útil si luego quieres borrarla desde el backend

        const [producto] = await sql`
            INSERT INTO productos (
                nombre,
                descripcion,
                main_image_id,
                precio,
                precio_anterior,
                tipo,
                stock
            )
            VALUES (
                ${titulo},
                ${info},
                ${imageUrl},
                ${precioNumero},
                ${precioAnteriorNumero},
                'pulsera',
                ${stockNumero}
            )
            RETURNING *
        `

        res.status(201).json({
            message: 'Producto creado correctamente',
            producto
        })

    } catch (err) {
        console.error('ERROR:', err)
        res.status(500).json({
            message: 'Error interno del servidor'
        })
    }
})

apiRouter.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: 'El ID no es válido'
            })

        }

        const {
            titulo,
            info,
            precio,
            precio_anterior,
            stock
        } = req.body


        /* -----------------------------------------
           VALIDAR PRECIO
        ----------------------------------------- */

        let precioNumero = null

        if (precio !== undefined) {

            precioNumero = Number(precio)

            if (
                !Number.isFinite(precioNumero) ||
                precioNumero < 0
            ) {

                return res.status(400).json({
                    message: 'El precio no es válido'
                })
            }
        }

        let precioAnteriorNumero = null

        if (precio_anterior !== undefined) {
            precioAnteriorNumero = Number(precio_anterior)

            if (!Number.isFinite(precioAnteriorNumero) || precioAnteriorNumero < 0) {
                return res.status(400).json({
                    message: 'El precio anterior no es válido'
                })
            }
        }

        /* -----------------------------------------
           VALIDAR STOCK
        ----------------------------------------- */

        let stockNumero = null

        if (stock !== undefined) {
            stockNumero = Number(stock)

            if (!Number.isInteger(stockNumero) || stockNumero < 0) {
                return res.status(400).json({
                    message: 'El stock no es válido'
                })
            }
        }

        /* -----------------------------------------
           ACTUALIZAR
        ----------------------------------------- */
        
        const [producto] = await sql`
            UPDATE productos
            SET
                nombre = COALESCE(${titulo ?? null}, nombre),
                descripcion = COALESCE(${info ?? null}, descripcion),
                precio = COALESCE(${precioNumero}, precio),
                precio_anterior = COALESCE(${precioAnteriorNumero}, precio_anterior),
                stock = COALESCE(${stockNumero}, stock)

            WHERE id = ${id}

            RETURNING *
        `

        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.status(200).json({
            message: 'Producto actualizado correctamente',
            producto
        })

    } catch (err) {
        console.error('ERROR:', err.message)

        res.status(500).json({
            message: 'Error interno del servidor'
        })
    }

})

apiRouter.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'El ID no es válido'
            })
        }

        const [producto] = await sql`
            DELETE FROM productos
            WHERE id = ${id}
            RETURNING *
        `

        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.status(200).json({
            message: 'Producto eliminado correctamente',
            producto
        })

    } catch (err) {
        console.error('ERROR:', err.message)

        res.status(500).json({
            message: 'Error interno del servidor'
        })
    }
})

export default apiRouter