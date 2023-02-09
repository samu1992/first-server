import router from 'express'
import { CartProductManager } from "../controllers/CartManager.js";



const cartProductManager = new CartProductManager('src/models/ProductCart.json')
const ProductCartRouter = router()



ProductCartRouter.get('/', async (req, res) => { 
    const { limit } = req.query; 
    console.log(limit)
    const productos = await cartProductManager.getProducts()
    console.log(productos)
    res.send(JSON.stringify(productos))
})

ProductCartRouter.get('/:id', async (req, res) => {
    const productId = req.params.id
    const product = await cartProductManager.getProductById(productId)
    res.send({product})
})

ProductCartRouter.post('/', async (req, res) => {
    const product = req.body
    const message = await cartProductManager.addProduct(product)
    res.send(message)
})

ProductCartRouter.put('/:id', async (req, res) => {
    const productId = req.params.id
    const updatedProduct = req.body
    const message = await cartProductManager.updateProduct(productId, updatedProduct)
    res.send(message)
})

ProductCartRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id
    const message = await cartProductManager.deleteProduct(productId)
    res.send(message)
})

export default ProductCartRouter