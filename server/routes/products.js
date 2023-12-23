import express from 'express';
import createConnection from '../db/connection.js';
const productsRouter = express.Router();
import { onlyAdmin } from '../middleware/admin.js';


productsRouter.get('/', async (req, res) => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); 
    }
});


productsRouter.get('/get_by_id/:id', async (req, res) => {
    const connection = await createConnection();
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`SELECT * FROM products WHERE product_id = ${id}`);
        if (rows.length === 0) {
            res.status(404).send('Product not found');
        }
        res.json( rows[0] );
    } catch (error) {
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Close the connection
    }
});

productsRouter.post('/add', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.query(`INSERT INTO products (name, price) VALUES ('${req.body.name}', ${req.body.price})`);
        res.send("Product added successfully");
    } catch (error) {
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Close the connection
    }
});

productsRouter.put('/update/:id', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.query(` UPDATE products SET name = '${req.body.name}', price = ${req.body.price} WHERE id = ${req.params.id}`);
        res.send('Update successful');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Close the connection
    }
});

productsRouter.delete('/delete/:id', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`DELETE FROM products WHERE id = ${id}`);
        res.send('Delete successful');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end(); // Close the connection
    }
});

export default productsRouter;