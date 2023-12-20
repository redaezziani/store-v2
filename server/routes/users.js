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
    };

    return jwt.sign(payload, 'reda', { expiresIn: '1h' });
};

usersRouter.post('/register', upload.single('profileImage'), async (req, res) => {
    const { user_name, email, password } = req.body;

    const imageBuffer = req.file ? req.file.buffer : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await createConnection();
    
    const [result] = await connection.query(
        'INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, "user")',
        [user_name, email, hashedPassword]
    );
    

    const newUser = {
        user_id: result.insertId,
        user_name,
        email,
        role: 'user',
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
});

async function saveImage(buffer, fileName) {
    const filePath = path.join('uploads', fileName);
    await fs.writeFile(filePath, buffer);
}


usersRouter.post('/login', async (req, res) => {
    const { user_name, password } = req.body;

    const connection = await createConnection();

    try {
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE user_name = ?',
            [user_name]
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

        res.json({ user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        connection.end(); 
    }
});


export default usersRouter;
