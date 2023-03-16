const { MongoClient } = require('mongodb');

export class ProductManager {
    constructor(connectionString, dbName) {
        this.connectionString = connectionString;
        this.dbName = dbName;
    }

    async addProduct(producto) {
        const client = new MongoClient(this.connectionString);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const result = await db.collection('products').insertOne(producto);
            return "Producto creado";
        } catch (error) {
            return error;
        } finally {
            await client.close();
        }
    }

    async getProducts(limit) {
        const client = new MongoClient(this.connectionString);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const prods = await db.collection('products').find().limit(limit).toArray();
            return prods;
        } catch (error) {
            return error;
        } finally {
            await client.close();
        }
    }

    async getProductById(id) {
        const client = new MongoClient(this.connectionString);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const result = await db.collection('products').findOne({ id: parseInt(id) });
            if (result) {
                return result;
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            return error;
        } finally {
            await client.close();
        }
    }

    async updateProduct(id, { title, description, price, thumbnail, code, stock, status, category }) {
        const client = new MongoClient(this.connectionString);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const result = await db.collection('products').updateOne(
                { id: parseInt(id) },
                { $set: { title, description, price, thumbnail, code, stock, status, category } }
            );
            if (result.matchedCount === 1) {
                return "Producto actualizado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            return error;
        } finally {
            await client.close();
        }
    }

    async deleteProduct(id) {
        const client = new MongoClient(this.connectionString);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            const result = await db.collection('products').deleteOne({ id: parseInt(id) });
            if (result.deletedCount === 1) {
                return "Producto eliminado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            return error;
        } finally {
            await client.close();
        }
    }
}
