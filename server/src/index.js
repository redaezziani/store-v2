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

import nodemailer from 'nodemailer';
const __dirname = dirname(__filename);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const mailOptions = {
  from: {
    name: "reda",
    address: "test email"
  },
  to: process.env.EMAIL,
  subject: "hello",
  html: "thanks for buying our products",
  attachments: [
    {
      filename: "logo.png",
      path: path.join(__dirname, "../uploads/06172901-11-4.jpeg"),
      cid: "logo",
      contentType: "image/png"
    }

  ]
};

const sendEmail = (mailOptions, transporter) => {

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent" + info.response);
    }
  });
}




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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.post("/api/checkout-session", async (req, res) => {
  try {
    console.log(req.body.user);
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: process.env.HOST_URL,
      cancel_url: process.env.HOST_URL,
    });
    sendEmail(mailOptions, transporter);
    return res.status(201).json(session);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log('connection was successful');
});
