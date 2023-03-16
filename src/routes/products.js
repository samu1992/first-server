import { Router } from 'express';
import  Product  from '../models/products.js';

const ProductRouter = Router();

ProductRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await Product.find().limit(limit ? parseInt(limit) : undefined);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

ProductRouter.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el producto');
    }
});

ProductRouter.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.send('Producto agregado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el producto');
    }
});

ProductRouter.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send('Producto actualizado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el producto');
    }
});

ProductRouter.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.send('Producto eliminado exitosamente');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
    }
});

export default ProductRouter;










/* import router from 'express'
import { ProductManager } from "../controllers/ProductManager.js";



const productManager = new ProductManager('src/models/products.txt')
const ProductRouter = router()



ProductRouter.get('/', async (req, res) => { 
    const { limit } = req.query; 
    const productos = await productManager.getProducts(limit)
    res.send(JSON.stringify(productos))
})

ProductRouter.get('/:id', async (req, res) => {
    const productId = req.params.id
    const product = await productManager.getProductById(productId)
    res.send({product})
})

ProductRouter.post('/', async (req, res) => {
    const product = req.body
    const message = await productManager.addProduct(product)
    res.send(message)
})

ProductRouter.put('/:id', async (req, res) => {
    const productId = req.params.id
    const updatedProduct = req.body
    const message = await productManager.updateProduct(productId, updatedProduct)
    res.send(message)
})

ProductRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id
    const message = await productManager.deleteProduct(productId)
    res.send(message)
})

export default ProductRouter
 */