import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
    }

   async addToCart(cartId, productId, quantity) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId))
        if (cartIndex === -1) {
            return 'Carrito no encontrado'
        }
        const cart = carts[cartIndex]
        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId))
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: quantity })
        } else {
            cart.products[productIndex].quantity += quantity
        }
        await fs.writeFile(this.path, JSON.stringify(carts))
        return "Producto agregado al carrito"
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

   /*  async addProductToCart(cartId, productId, quantity) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId))
        if (cartIndex === -1) {
            return 'El carrito con el id proporcionado no fue encontrado'
        }
        const cart = carts[cartIndex]
        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId))
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity })
        } else {
            cart.products[productIndex].quantity += quantity
        }
        await fs.writeFile(this.path, JSON.stringify(carts))
        return cart
    } */
}
