import productsRouter from '../routes/products.js';
import categoriesRouter from '../routes/categories.js';
import usersRouter from '../routes/users.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
const __filename = fileURLToPath(import.meta.url);
import 
dotenv
from 'dotenv';

dotenv.config();


const corsOptions = {
    origin: '*',
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


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.post("/api/checkout-session", async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: req.body.lineItems,
        mode: "payment",
        payment_method_types: ["card"],
        success_url: process.env.HOST_URL,
        cancel_url: process.env.HOST_URL,
      });
      return res.status(201).json(session);
    } catch (error) {
        console.log(error);
      return res.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => {
    console.log('connection was successful');
});
