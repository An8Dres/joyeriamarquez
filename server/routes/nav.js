import { Router } from "express"

const navRouter = new Router()

navRouter.get('/search', (req, res) => res.render('template', null))
navRouter.get('/orders', (req, res) => res.render('template', null))
navRouter.get('/favorites', (req, res) => res.render('template', null))
navRouter.get('/offers', (req, res) => res.render('template', null))
navRouter.get('/cart', (req, res) => res.render('template', null))
navRouter.get('/profile', (req, res) => res.render('template', null))

export default navRouter
