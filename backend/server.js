// 1. THIS MUST BE THE ABSOLUTE FIRST LINE
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const adminImageRoutes = require('./routes/adminImageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin/images', adminImageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Attempt to connect to the database
        await connectDB();
        
        // Only start listening for traffic if the DB connects successfully
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        // If it crashes, YELL AT US with the exact error
        console.error("CRITICAL ERROR: Failed to start server!");
        console.error(error);
        process.exit(1);
    }
};

startServer();