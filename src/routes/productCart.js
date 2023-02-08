import router from 'express'
import { ProductManagerCart, CartManager } from "../controllers/CartManager.js";

const ProductCartRouter = router()
const productManagerCart = new ProductManagerCart('src/models/ProductCart.json')
const cartManager = new CartManager('src/models/Cart.json')


ProductCartRouter.get('/products', async (req, res) => {
    const products = await productManagerCart.getProducts()
    res.send(products)
})

ProductCartRouter.post('/products', async (req, res) => {
    const product = req.body
    const message = await productManagerCart.addProduct(product)
    res.send(message)
})

ProductCartRouter.put('/products/:id', async (req, res) => {
    const productId = req.params.id
    const updatedProduct = req.body
    const message = await productManagerCart.updateProduct(productId, updatedProduct)
    res.send(message)
})

ProductCartRouter.delete('/products/:id', async (req, res) => {
    const productId = req.params.id
    const message = await productManagerCart.deleteProduct(productId)
    res.send(message)
})

ProductCartRouter.get('/carts/:id', async (req, res) => {
    const cartId = req.params.id
    const cart = await cartManager.getCart(cartId)
    res.sendStatus(cart)
})

ProductCartRouter.post('/carts', async (req, res) => {
    const newCart = await cartManager.createCart()
    res.send(newCart)
})

ProductCartRouter.put('/carts/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId
    const productId = req.params.productId
    const quantity = req.body.quantity
    const cart = await cartManager.addProductToCart(cartId, productId, quantity)
    res.send(cart)
})
export default ProductCartRouter