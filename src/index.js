import express from "express";
import ProductRouter from "./routes/products.js";
import CartRouter from "./routes/CartR.js";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { Server } from "socket.io";
//import routerSocket from "./routes/socket.js";
import fs from 'fs'
import { ProductManager } from "./controllers/ProductManager.js";

let productos = []

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "./views"))

io.on("connection", (socket) => {
    console.log("conectado con socket")

    const filePath = path.join(__dirname, 'models', 'products.txt');
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) throw err;
            productos = JSON.parse(data);
            socket.emit("productos", productos);
        });
    }

    socket.on('productos', (data) => {
        productos = data;
        console.log(productos);
    });
    socket.on("nuevo-producto", (producto) => {
        const nuevoId = ProductManager.incrementarID();
        producto.id = nuevoId;
        productos.push(producto);
        fs.writeFile(filePath, JSON.stringify(productos, null, 2), (err) => {
            if (err) throw err;
            console.log("Archivo actualizado");
        });
        io.sockets.emit("productos", productos);
    });
    socket.on('eliminar-producto', (id) => {
        productos = productos.filter((producto) => producto.id !== id);
        fs.writeFile(filePath, JSON.stringify(productos, null, 2), (err) => {
            if (err) throw err;
            console.log("Archivo actualizado");
        });
        io.sockets.emit("productos", productos);
    });
});


//Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/api/product', ProductRouter)
app.use('/api', CartRouter)
//app.use('/', routerSocket)

app.get('/realtimeproducts', async (req, res) => {
    res.render("realTimesProducts", {
        title: "productos",
        mensaje: "Productos",
        productos
    })
})
app.get('/', async (req, res) => {
    res.render("inicio", {
        title: "Inicio",
        mensaje: "Pagina de Inicio",
        productos
    })
})


app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.send("Imagen cargada")
})
