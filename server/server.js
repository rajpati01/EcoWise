
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv')
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// load .env variable
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); 
app.use('/api/auth', authRoutes)

// Connect DB and start the server 
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 EcoWise server running on port ${PORT}`);
    })
})