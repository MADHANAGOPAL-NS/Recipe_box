//main server logic

const express = require('express');

const dotenv = require('dotenv');

dotenv.config();

const path = require('path');

const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const recipeRoutes = require('./routes/recipeRoutes');

connectDB();

const app = express();

//Middleware

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

//Test routing

app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

// API Routes
app.use('/api/auth', authRoutes);

//recipe API

app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});