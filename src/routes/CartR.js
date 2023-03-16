import express from 'express';
import { Router } from 'express';
import { Cart } from '../models/Cart.js';
import  Product  from '../models/products.js';


const router = express.Router();
// Obtener todos los carritos
router.get('/cart', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product', 'title price');
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los carritos');
    }
});

// Obtener un carrito por su ID
router.get('/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await Cart.findById(cartId).populate('products.product', 'title price');
        if (!cart) {
            res.status(404).send('Carrito no encontrado');
        } else {
            res.json(cart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Crear un carrito nuevo
router.post('/cart', async (req, res) => {
    try {
        const newCart = await Cart.create({});
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el carrito');
    }
});

// Agregar un producto a un carrito
router.post('/cart/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);
        if (!cart) {
            res.status(404).send('Carrito no encontrado');
        } else if (!product) {
            res.status(404).send('Producto no encontrado');
        } else {
            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            await cart.save();
            res.send('Producto agregado al carrito');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Eliminar un carrito por su ID
router.delete('/cart/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const result = await Cart.findByIdAndDelete(cartId);
        if (!result) {
            res.status(404).send('Carrito no encontrado');
        } else {
            res.send('Carrito eliminado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el carrito');
    }
});

export default router;
