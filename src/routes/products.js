import router from 'express'
import { ProductManager } from "../controllers/ProductManager.js";



const productManager = new ProductManager('src/models/products.txt')
const ProductCartRouter = router()



ProductCartRouter.get('/', async (req, res) => { 
    const { limit } = req.query; 
    const productos = await productManager.getProducts(limit)
    res.send(JSON.stringify(productos))
})

ProductCartRouter.get('/:id', async (req, res) => {
    const productId = req.params.id
    const product = await productManager.getProductById(productId)
    res.send({product})
})

ProductCartRouter.post('/', async (req, res) => {
    const product = req.body
    const message = await productManager.addProduct(product)
    res.send(message)
})

ProductCartRouter.put('/:id', async (req, res) => {
    const productId = req.params.id
    const updatedProduct = req.body
    const message = await productManager.updateProduct(productId, updatedProduct)
    res.send(message)
})

ProductCartRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id
    const message = await productManager.deleteProduct(productId)
    res.send(message)
})

export default ProductCartRouter
