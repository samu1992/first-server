import express from 'express';
import { ProductManager } from './ProductManager.js'


const manager = new ProductManager('./src/products.txt');


const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/productos', (req, res) => {
    let {limit} = req.query;
    let products = manager.getAllProducts(limit);
    res.json(products);
    console.log(products)
});
app.get('/productos/:categoria', (req, res) => {
    let products = manager.filterProductsByCategory(req.params.categoria);
    res.json(products.categoria);
});

app.get('/productos/:id', (req, res) => {
    let product = manager.getProductById(req.params.id);
    if (!product || product.id === undefined) {
    res.json({error: "No existe el producto"});
    } else {
    res.json(product);
    }
});  
app.post('/productos', (req, res) => {
    let product = manager.addProduct(req.body)
    res.json(product);
}); 

app.delete('/productos/:id', (req, res) => {
    let product = manager.deleteProduct(req.params.id)
    res.json(product);
});

app.get('/', (req, res) => {
    res.send("hola esta es la pagina de inicio")
})

app.get('/user', (req, res) => {
    let {nombre, apellido}= req.query
    console.log(nombre, apellido)
    res.send("user route")
})

app.listen(PORT, ()=>{
    console.log(`server on port ${PORT}`)
})