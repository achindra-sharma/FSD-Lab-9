// Import necessary packages
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MySQL Database Connection ---
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// --- Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename to avoid overwriting
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// --- Nodemailer Configuration for Sending Emails ---
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or any other email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use the App Password
    },
});

// --- REST API Endpoints ---

// 1. CREATE: Register a new user
app.post('/api/users', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        // The path to the uploaded file is available in req.file.path
        const profilePicturePath = req.file ? req.file.path : null;

        const [result] = await db.query(
            'INSERT INTO users (name, email, phone, profile_picture) VALUES (?, ?, ?, ?)',
            [name, email, phone, profilePicturePath]
        );

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Successful!',
            html: `<h1>Welcome, ${name}!</h1><p>You have successfully registered for our platform.</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // We don't fail the whole request if email fails, just log it.
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

// 2. READ: Get all registered users
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users ORDER BY created_at DESC');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. UPDATE: Update a user's details (Example: updating name and phone)
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

// 4. DELETE: Delete a user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Optional: Also delete the profile picture file from the server
        // const [user] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [id]);
        // if (user.length > 0 && user[0].profile_picture) {
        //     fs.unlinkSync(user[0].profile_picture);
        // }
        
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});


// --- Start the server ---
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});