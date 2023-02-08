import express from "express";
import routerProd from './routes/product.js'
import ProductCartRouter from "./routes/productCart.js";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 8080

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/product', routerProd)
app.use('/api', ProductCartRouter)

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.send("Imagen cargada")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})