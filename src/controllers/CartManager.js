import { promises as fs } from 'fs'

export class ProductManagerCart {
    constructor(path) {
        this.path = path
    }

    async addProduct(product) {
        const products = await this.getProducts()
        product.id = products.length + 1
        products.push(product)
        await fs.writeFile(this.path, JSON.stringify(products))
        return "Producto agregado"
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === id)
        if (productIndex === -1) {
            return 'Producto no encontrado'
        }
        Object.assign(products[productIndex], updatedProduct)
        await fs.writeFile(this.path, JSON.stringify(products))
        return "Producto actualizado"
    }

    async deleteProduct(productId) {
        const products = await this.getProducts()
        const productIndex = products.findIndex(p => p.id === productId)
        if (productIndex < 1) {
            return 'Producto no encontrado'
        }
        products.splice(productIndex, 1)
        await fs.writeFile(this.path, JSON.stringify(products))
        return "Producto eliminado"
    }

    async getProducts(id) {
        try {
            const products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
            return products
        } catch (error) {
            return error
        }
    }
}

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async addToCart(cartId, productId, quantity) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === cartId)
        if (cartIndex === -1) {
            return 'Carrito no encontrado'
        }
        const cart = carts[cartIndex]
        const productIndex = cart.products.findIndex(p => p.product === productId)
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: quantity })
        } else {
            cart.products[productIndex].quantity += quantity
        }
        await fs.writeFile(this.path, JSON.stringify(carts))
        return "Producto agregado al carrito"
    }

    async getCart(cartId) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === cartId)
        if (cartIndex === -1) {
            return 'Carrito no encontrado'
        }
        return carts[cartIndex]
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
        const cart = carts.findIndex(c => c.id === cartId)
        return cart || null
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === cartId)
        if (cartIndex === -1) {
            return 'El carrito con el id proporcionado no fue encontrado'
        }
        const cart = carts[cartIndex]
        const productIndex = cart.products.findIndex(p => p.product === productId)
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity })
        } else {
            cart.products[productIndex].quantity += quantity
        }
        await fs.writeFile(this.path, JSON.stringify(carts))
        return cart
    }
}