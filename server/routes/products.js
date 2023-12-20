import express from 'express';
import createConnection from '../db/connection.js';
const productsRouter = express.Router();


productsRouter.get('/', async (req, res) => {
    const connection = await createConnection();
    const [rows] = await connection.query('SELECT * FROM products');
    res.send(rows);
});


productsRouter.get('/get_by_id/:id', async (req, res) => {
    const connection = await createConnection();
    const { id } = req.params;
    console.log(id);
    const [rows] = await connection.query(`SELECT * FROM products WHERE product_id = ${id}`);
    res.send(rows);
});



productsRouter.post('/add', async (req, res) => {
    const connection = await createConnection();
    const [rows] = await connection.query(`INSERT INTO products (name, price) VALUES ('${req.body.name}', ${req.body.price})`);
    res.send(rows);
});


productsRouter.put('/update/:id', async (req, res) => {
    const connection = await createConnection();
    const [rows] = await connection.query(`UPDATE products SET name = '${req.body.name}', price = ${req.body.price} WHERE id = ${req.params.id}`);
    res.send(rows);
});

productsRouter.delete('/delete/:id', async (req, res) => {
    const connection = await createConnection();
    const { id } = req.params;
    const [rows] = await connection.query(`DELETE FROM products WHERE id = ${id}`);
    res.send(rows);
});


export default productsRouter;