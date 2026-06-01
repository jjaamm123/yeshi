const mongoose = require('mongoose');

const variationSchema = new mongoose.Schema({
    size: { type: String, required: true },
    color: { type: String, required: true },
    stockCount: { type: Number, required: true, default: 0 }
});

const imageSchema = new mongoose.Schema({
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    variations: [variationSchema],
    images: [imageSchema],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
