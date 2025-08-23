const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

app.post('/api/users', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const profilePicturePath = req.file ? req.file.path : null;

        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, profile_picture) VALUES (?, ?, ?, ?)',
            [name, email, phone, profilePicturePath]
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Successful!',
            html: `<h1>Welcome, ${name}!</h1><p>You have successfully registered for our platform.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({ id: result.insertId, message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error or duplicate email' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        await db.query(
            'UPDATE users SET name = ?, phone = ? WHERE id = ?',
            [name, phone, id]
        );

        res.status(200).json({ message: 'User updated successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [id]);
        if (user.length > 0 && user[0].profile_picture) {
             fs.unlinkSync(user[0].profile_picture);
            }
        
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
