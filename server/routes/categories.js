import express from 'express';
import createConnection from '../db/connection.js';
import { onlyAdmin } from '../middleware/admin.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM categories');
        res.send(rows);
    } catch (error) {
        res.status(500).send('Error retrieving categories');
    } finally {
        connection.end();
    }
});

categoriesRouter.get('/get_by_id/:id', async (req, res) => {
    const connection = await createConnection();
    try {
        const { id } = req.params;
        console.log(id);
        const [rows] = await connection.query(`SELECT * FROM categories WHERE  categorie_id = ${id}`);
        res.send(rows);
    } catch (error) {
        res.status(500).send('Error retrieving category by ID');
    } finally {
        connection.end();
    }
});

categoriesRouter.get('/get_all_products/:id', async (req, res) => {
    const connection = await createConnection();
    try {
        const { id } = req.params;
        console.log(id);
        const [rows] = await connection.query(`SELECT * FROM products WHERE categorie_id = ${id}`);
        res.send(rows);
    } catch (error) {
        res.status(500).send('Error retrieving products by category ID');
    } finally {
        connection.end();
    }
});

categoriesRouter.post('/add', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const { category_name, category_image, category_desc } = req.body;
        const [rows] = await connection.query(`INSERT INTO categories (category_name, category_image, category_desc) VALUES ('${category_name}', '${category_image}', '${category_desc}')`);
        res.send("Category added successfully");
    } catch (error) {
        res.status(500).send('Error adding category');
    } finally {
        connection.end();
    }
});

categoriesRouter.put('/update/:id', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const [rows] = await connection.query(`UPDATE categories SET name = '${req.body.name}' WHERE id = ${req.params.id}`);
        const [rows2] = await connection.query(`UPDATE products SET category = '${req.body.name}' WHERE category_id = ${req.params.id}`);
        res.send('Update successful');
    } catch (error) {
        res.status(500).send('Update failed');
    } finally {
        connection.end();
    }
});

categoriesRouter.delete('/delete/:id', onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    try {
        const { id } = req.params;
        const [rows] = await connection.query(`DELETE FROM categories WHERE id = ${id}`);
        res.send(rows);
    } catch (error) {
        res.status(500).send('Error deleting category');
    } finally {
        connection.end();
    }
});

export default categoriesRouter;
