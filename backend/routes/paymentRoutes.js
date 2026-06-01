const express = require('express');
const { verifyKhalti, signEsewa, createOrder } = require('../controllers/paymentController');

const router = express.Router();

router.post('/khalti/verify', verifyKhalti);
router.post('/esewa/sign', signEsewa);
router.post('/create-order', createOrder);

module.exports = router;
