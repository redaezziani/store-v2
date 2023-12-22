// server/routes/users.js
import express from 'express';
import createConnection from '../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const usersRouter = express.Router();
const upload = multer();

const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    user_name: user.user_name,
    role: user.role,
    profile_image: user.image_profile,
  };
  return jwt.sign(payload, 'reda', { expiresIn: '1h' });
};

usersRouter.post('/register', upload.single('profile_image'), async (req, res) => {
  const { user_name, email, password } = req.body;

  const imageBuffer = req.file ? req.file.buffer : null;

  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await createConnection();

  try {
    const [result] = await connection.query(
      'INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, "admin")',
      [user_name, email, hashedPassword]
    );

    const newUser = {
      user_id: result.insertId,
      user_name,
      email,
      role: 'user',
      profile_image: null,
    };

    if (imageBuffer) {
      const fileName = `profile_${newUser.user_id}.jpg`;

      await saveImage(imageBuffer, fileName);

      await connection.query(
        'UPDATE users SET image_profile = ? WHERE user_id = ?',
        [fileName, newUser.user_id]
      );

      newUser.image_profile = fileName;
    }

    const token = generateToken(newUser);

    res.json({ user: newUser, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.end();
  }
});

async function saveImage(buffer, fileName) {
  const filePath = path.join('uploads', fileName);
  await fs.writeFile(filePath, buffer);
}

usersRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const connection = await createConnection();
    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ user: user, token: token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.end();
    }
});



usersRouter.get('/me', async (req, res) => {
   
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        
      const payload = jwt.verify(token, 'reda');
      res.json({ user: payload });
    } catch (error) {
      console.error('Error decoding token:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


usersRouter.get('/logout', async (req, res) => {
    res.json({ token: null });
    }
);



export default usersRouter;
