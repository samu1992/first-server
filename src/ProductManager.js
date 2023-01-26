
import fs from 'fs';
class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct(name, price, description, stock, image, code, categoria) {
        let product = {
            id: this.getNextId(),
            name: name,
            price: price,
            description: description,
            stock: stock,
            image: image,
            code: code,
            categoria: categoria
        };
        let products = this.getProducts();
        products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(products));
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
        let product = products.find(p => p.id == id);
        return product;
        console.log(product);
    }

    updateProduct(id, product) {
        let products = this.getProducts();
        let index = products.findIndex(p => p.id == id);
        products[index] = product;
        fs.writeFileSync(this.path, JSON.stringify(products));
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        fs.writeFileSync(this.path, JSON.stringify(products));
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


//db.deleteProduct(3);
//db.getProductById(4);
//db.updateProduct(6, {id: 4, name: "botas de cuero", price: 1000, description: "cuero", stock: 2, image: "sin imagen", code: "123abc"})
//console.log(db.getProducts());
export { ProductManager }