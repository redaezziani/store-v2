import productsRouter from '../routes/products.js';
import categoriesRouter from '../routes/categories.js';
import usersRouter from '../routes/users.js';
import express from 'express';// this is just for create server
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);


const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});
