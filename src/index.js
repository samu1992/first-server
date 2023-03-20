import express from "express";
import ProductRouter from "./routes/products.js";
import router from "./routes/CartR.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path';
import { Server } from "socket.io";
//import routerSocket from "./routes/socket.js";
import userRouter from "./routes/user.js";
import mongoose from "mongoose";
import  Product  from './models/products.js';

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

const app = express();
const PORT = 4000;

mongoose.connect('mongodb+srv://samuelcarrizot:Soley1912@cluster0.75eou1e.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a la base de datos de MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit();
    });


    // Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});


// Routes
app.use('/', express.static(__dirname + '/public'));
app.use('/api/product', ProductRouter);
app.use('/api', router);
app.use('/users', userRouter);
app.use('/api/cart', router);

app.get('/', async (req, res) => {
    // los productos en la base de datos y enviarlos a la vista
    const productos = await Product.find({});
    res.render("realTimesProducts", {
        title: "productos",
        mensaje: "Productos",
        productos
    });
});

app.get('/', async (req, res) => {
    // los productos en la base de datos y enviarlos a la vista
    const productos = await Product.find({});
    res.render("inicio", {
        title: "Inicio",
        mensaje: "Pagina de Inicio",
        productos
    });
});

app.post('/productos', async (req, res) => {
    try {
        const producto = new Product(req.body);
        await producto.save();
        res.status(201).send(producto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al crear el producto');
    }
});
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.send("Imagen cargada");
});
app.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || '';
    const sort = req.query.sort || '';
    const skip = (page - 1) * limit;
    const match = query ? { tipo: { $regex: query, $options: 'i' } } : {};
    const sortOptions = sort === 'asc' ? { precio: 1 } : sort === 'desc' ? { precio: -1 } : {};
    try {
        const count = await Product.countDocuments(match);
        const totalPages = Math.ceil(count / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevLink = hasPrevPage ? `/api/product?limit=${limit}&page=${prevPage}&query=${query}&sort=${sort}` : null;
        const nextLink = hasNextPage ? `/api/product?limit=${limit}&page=${nextPage}&query=${query}&sort=${sort}` : null;
        const productos = await Product.find(match)
            .sort(sortOptions)
            .limit(limit)
            .skip(skip);
        res.json({
            status: 'success',
            payload: productos,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Hubo un error al obtener los productos' });
    }
});
export default app;