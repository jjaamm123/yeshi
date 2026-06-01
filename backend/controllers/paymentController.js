const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');

const verifyKhalti = async (req, res) => {
    const { token, amount } = req.body;
    try {
        const payload = { token, amount };
        const khaltiRes = await axios.post('https://khalti.com/api/v2/payment/verify/', payload, {
            headers: {
                'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`
            }
        });

        if (khaltiRes.data.idx) {
            return res.json({ success: true, transactionId: khaltiRes.data.idx });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const signEsewa = (req, res) => {
    const { amount, transaction_uuid } = req.body;
    
    const product_code = 'epay_payment';
    const secret_key = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q'; 
    
    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    
    const signature = crypto.createHmac('sha256', secret_key)
                            .update(message)
                            .digest('base64');
                            
    res.json({ signature, product_code });
};

const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ success: true, orderRef: newOrder.orderRef });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { verifyKhalti, signEsewa, createOrder };
