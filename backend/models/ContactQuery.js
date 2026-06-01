const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
