const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/ContactQuery');

// POST /api/contact — Submit a contact form query
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        const query = new ContactQuery({ name, email, subject, message });
        await query.save();

        res.status(201).json({ message: 'Your message has been received. We\'ll be in touch shortly.' });
    } catch (error) {
        console.error('Error saving contact query:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// GET /api/contact — Fetch all queries (admin inbox)
router.get('/', async (req, res) => {
    try {
        const queries = await ContactQuery.find().sort({ createdAt: -1 });
        res.status(200).json(queries);
    } catch (error) {
        console.error('Error fetching contact queries:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PATCH /api/contact/:id/read — Mark a query as read
router.patch('/:id/read', async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        if (!query) return res.status(404).json({ message: 'Query not found.' });
        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
