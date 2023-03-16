import mongoose from "mongoose";

let Product;

try {
    Product = mongoose.model('Product');
} catch (error) {
    const productSchema = new mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String, required: true },
        code: { type: String, required: true },
        stock: { type: Number, required: true },
        status: { type: String, required: true },
        category: { type: String, required: true },
    });

    Product = mongoose.model('Product', productSchema);
}

export default Product;

/* {
    "title":"zapatillas",
    "description":"nike",
    "price":"35",
    "thumbnail":"thumbnail",
    "code":"1515awda",
    "stock":"25",
    "status":"true",
    "category":"hombre"
} */