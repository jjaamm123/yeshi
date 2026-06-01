const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createPaymentIntent = async (req, res) => {
    try {
        const { items, customerDetails } = req.body;
        
        const totalAmount = items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            metadata: {
                customerName: customerDetails.name,
                customerEmail: customerDetails.email,
                items: JSON.stringify(items.map(item => ({ id: item.id, qty: item.quantity, size: item.size, color: item.color })))
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const parsedItems = JSON.parse(paymentIntent.metadata.items);
        
        const newOrder = new Order({
            orderRef: 'ORD-' + Date.now(),
            items: parsedItems.map(i => ({
                name: i.id,
                priceAtPurchase: paymentIntent.amount / parsedItems.length,
                size: i.size,
                color: i.color,
                quantity: i.qty
            })),
            totalAmount: paymentIntent.amount,
            status: 'pending',
            paymentStatus: 'paid',
            customerDetails: {
                name: paymentIntent.metadata.customerName,
                email: paymentIntent.metadata.customerEmail,
                address: "Provided by Stripe"
            }
        });
        
        await newOrder.save();
    }

    res.json({ received: true });
};

module.exports = { createPaymentIntent, handleWebhook };
