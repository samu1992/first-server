import fs from 'fs';
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    
    addProduct(name, price, description, stock, image, categoria) {
        let product = {
            id: this.getNextId(),
            name: name,
            price: price,
            description: description,
            stock: stock,
            image: image,
            categoria: categoria
        };
        let products = this.getProducts();
        products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(products));
        return product;
    }

    getProducts() {
        if (!fs.existsSync(this.path)){
            fs.openSync(this.path, 'w');
            return []
        }
        let data = fs.readFileSync(this.path);
        let products = JSON.parse(data);
        return products;
    }

    filterProductsByCategory(category) {
        let products = this.getProducts();
        let filteredProducts = products.filter(p => p.categoria === category);
        return filteredProducts;
    }

    getProductById(id) {
        let products = this.getProducts();
        let product = products.find(p => p.id === parseInt(id));
        return product;
    }

    updateProduct(id, product) {
        let products = this.getProducts();
        let index = products.findIndex(p => p.id === id);
        products[index] = product;
        fs.writeFileSync(this.path, JSON.stringify(products));
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        fs.writeFileSync(this.path, JSON.stringify(products));
        return products;
    }

    getAllProducts(limit) {
    let products = [...this.getProducts()];
    return products.slice(0, limit);
}

    getNextId() {
        let products = this.getProducts();
        let nextId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        return nextId;
    }
} 
let db = new ProductManager('./src/products.txt');

bien
export { ProductManager }   