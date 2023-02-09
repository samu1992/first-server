import router from 'express'
import { CartManager } from "../controllers/Cart.js";


const cartManager = new CartManager('src/models/Cart.json')
const CartRouter = router()
//cart
CartRouter.get('/cart/:cartId', async (req, res) => {
    const { cartId: cartIdString } = req.params
    const cartId = parseInt(cartIdString, 10)
    const cart = await cartManager.getCart(cartId)
    if (!cart) {
        res.status(404).send('Carrito no encontrado')
    } else {
        res.json(cart)
    }
})

CartRouter.delete('/cart/:cartId', async (req, res) => {
    const { cartId: cartIdString } = req.params
    const cartId = parseInt(cartIdString, 10)
    const cart = await cartManager.removeCart(cartId)
    if (!cart) {
        res.status(404).send('Carrito no encontrado')
    } else {
        res.json(cart)
    }
})
CartRouter.post('/cart', async (req, res) => {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
})

CartRouter.post('/carts/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId
    const productId = req.params.productId
    const quantity = req.body.quantity
    const result = await cartManager.addProductToCart(cartId, productId, quantity)
    if (typeof result === 'string') {
        res.status(404).send(result)
    } else {
        res.send(result)
    }
})
export default CartRouter