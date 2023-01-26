import express from 'express';
import { ProductManager } from './ProductManager.js'


const manager = new ProductManager('./src/products.txt');


const app = express()
const PORT = 4000

app.use(express.urlencoded({extended: true}))

app.get('/productos', (req, res) => {
    let {categoria} = req.query;
    let products = manager.filterProductsByCategory(categoria);
    res.json(products);
    console.log(products)
});
 
app.get('/productos/:id', (req, res)=>{
    let product = manager.getProductById(req.params.id)
    res.json(product)
    console.log(product)
})

app.get('/todos_los_productos', (req, res) => {
    let {limit} = req.query;
    let products = manager.getAllProducts();
    let limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
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