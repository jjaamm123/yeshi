const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderRef: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed', 'refunded'], default: 'unpaid' },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true }
    }
}, { timestamps: true });

orderSchema.pre('validate', function(next) {
    if (!this.orderRef) {
        this.orderRef = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
