import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";
const cartManager = new CartManager('src/models/ProductCart.txt')
const routerCart = Router()

routerCart.get('/', async (req, res) => { 
    const carts = await cartManager.getProducts()
    res.send(JSON.stringify(carts))
})

routerCart.get('/:id', async (req, res) => { 
    const products = await cartManager.getProducts()
    const cart = products.find(p => p.id === req.params.id)
    res.send(JSON.stringify(cart))
})

routerCart.post('/', async (req, res) => { 
    let mensaje = await cartManager.addProduct(req.body.productId, req.body.quantity)
    res.send(mensaje)
})

routerCart.delete('/:id', async (req, res) => {
    let mensaje = await cartManager.removeProduct(req.params.id, req.body.quantity) 
    res.send(mensaje)
})

routerCart.put('/:id', async (req, res) => { 
    let mensaje = await cartManager.updateCart(req.params.id, req.body)
    res.send(mensaje)
})

export default routerCart 
