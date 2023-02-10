import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async addToCart(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === parseInt(cartId));
        if (!cart) {
            return 'Carrito no encontrado';
        }
        let newProduct = { product: parseInt(productId), quantity: parseInt(quantity) };
        let exists = false;
        for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i].product === newProduct.product) {
                cart.products[i].quantity += newProduct.quantity;
                exists = true;
                break;
            }
        }
        if (!exists) {
            cart.products.push(newProduct);
        }
        await fs.writeFile(this.path, JSON.stringify(carts));
        return "Producto agregado al carrito";
    }
    
    async getCarts() {
        try {
            const carts = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return carts
        } catch (error) {
            return error
        }
    }

    async createCart() {
        const carts = await this.getCarts()
        const id = carts.length + 1
        const newCart = { id, products: [] }
        carts.push(newCart)
        await fs.writeFile(this.path, JSON.stringify(carts))
        return newCart
    }

    async getCart(cartId) {
        const carts = await this.getCarts()
        const cart = carts.find(c => c.id === cartId)
        return cart || null
    }
    async removeCart(cartId) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === cartId)
        if (cartIndex === -1) {
            return 'El carrito con el id proporcionado no fue encontrado'
        }
        carts.splice(cartIndex, 1)
        await fs.writeFile(this.path, JSON.stringify(carts))
        return 'El carrito fue eliminado'
    }
}
