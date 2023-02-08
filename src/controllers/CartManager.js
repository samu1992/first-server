import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(productId, quantity) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === productId)
        if (productIndex === -1) {
            return 'Producto no encontrado en el carrito'
        }
        products[productIndex].quantity = (products[productIndex].quantity || 0) + quantity
        await fs.writeFile(this.path, JSON.stringify(products))
        return "Producto agregado al carrito"
    }

    async removeProduct(productId, quantity) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === productId)
        if (productIndex === -1) {
            return 'Producto no encontrado en el carrito'
        }
        if (products[productIndex].quantity <= quantity) {
            products.splice(productIndex, 1)
        } else {
            products[productIndex].quantity -= quantity
        }
        await fs.writeFile(this.path, JSON.stringify(products))
        return "Producto eliminado del carrito"
    }

    async getProducts() {
        try {
            const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return products
        } catch (error) {
            return error
        }
    }

    async getTotal() {
        const products = await this.getProducts()
        return products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0)
    }

    async clearCart() {
        await fs.writeFile(this.path, JSON.stringify([]))
        return 'Carrito de compras vaciado'
    }
}
