import { Router } from "express";
import { ProductManagerCart, CartManager } from "../controllers/CartManager.js";

const productCartRouter = Router()
const productManagerCart = new ProductManagerCart('src/models/ProductCart.txt')
const cartManager = new CartManager('src/models/Cart.txt')


productCartRouter.post('/products', async (req, res) => {
    const result = await productManagerCart.addProduct(req.body)
    res.send({ result })
})

productCartRouter.put('/products/:id', async (req, res) => {
    const result = await productManagerCart.updateProduct(req.params.id, req.body)
    res.send({ result })
})

productCartRouter.delete('/products/:id', async (req, res) => {
    const result = await productManagerCart.deleteProduct(req.params.id)
    res.send({ result })
})

productCartRouter.get('/products', async (req, res) => {
    const products = await productManagerCart.getProducts()
    res.send({ products })
})

productCartRouter.post('/carts', async (req, res) => {
    const cart = await cartManager.createCart()
    res.send({ cart })
})

productCartRouter.get('/carts/:id', async (req, res) => {
    const cart = await cartManager.getCart(req.params.id)
    res.send({ cart })
})

productCartRouter.post('/carts/:cartId/products/:productId', async (req, res) => {
    const result = await cartManager.addProductToCart(req.params.cartId, req.params.productId, req.body.quantity)
    res.send({ result })
})

export default productCartRouter
