import express from 'express';
import createConnection from '../db/connection.js';
import { onlyAdmin } from '../middleware/admin.js';

const categoriesRouter = express.Router();


categoriesRouter.get('/', async (req, res) => {
    const connection = await createConnection();
    const [rows] = await connection.query('SELECT * FROM categories');
    res.send(rows);
}
);


categoriesRouter.get('/get_by_id/:id', async (req, res) => {
    const connection = await createConnection();
    const { id } = req.params;
    console.log(id);
    const [rows] = await connection.query(`SELECT * FROM categories WHERE  categorie_id = ${id}`);
    res.send(rows);
}
);

categoriesRouter.get('/get_all_products/:id', async (req, res) => {
    const connection = await createConnection();
    const { id } = req.params;
    console.log(id);
    const [rows] = await connection.query(`SELECT * FROM products WHERE categorie_id = ${id}`);
    res.send(rows);
}
);

categoriesRouter.post('/add',onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    const [rows] = await connection.query(`INSERT INTO categories (name) VALUES ('${req.body.name}')`);
    res.send(rows);
}
);

categoriesRouter.put('/update/:id',onlyAdmin, async (req, res) => {
    try {
        const connection = await createConnection();
        const [rows] = await connection.query(`UPDATE categories SET name = '${req.body.name}' WHERE id = ${req.params.id}`);
        const [rows2] = await connection.query(`UPDATE products SET category = '${req.body.name}' WHERE category_id = ${req.params.id}`);
        res.send('Update successful');
    } catch (error) {
        res.status(500).send('Update failed');
    }
});


categoriesRouter.delete('/delete/:id',onlyAdmin, async (req, res) => {
    const connection = await createConnection();
    const { id } = req.params;
    const [rows] = await connection.query(`DELETE FROM categories WHERE id = ${id}`);
    res.send(rows);
}
);

export default categoriesRouter;


