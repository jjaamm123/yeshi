const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const adminImageRoutes = require('./routes/adminImageRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const { handleWebhook } = require('./controllers/checkoutController');

dotenv.config();

const app = express();

app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(cors());
app.use(express.json());

app.use('/api/admin/images', adminImageRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
