const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create a Product
router.post('/', async (req, res) => {
    try {
        const { name, description, basePrice, category, subCategory, variations, images, isActive } = req.body;

        // Validation constraints as per schema
        if (!['Apparel', 'Shoes'].includes(category)) {
            return res.status(400).json({ message: 'Category must be strictly Apparel or Shoes' });
        }
        
        if (!variations || variations.length === 0) {
            return res.status(400).json({ message: 'Product must have at least one variation' });
        }

        if (!images || images.length > 5) {
            return res.status(400).json({ message: 'Product can have a maximum of 5 images' });
        }

        const newProduct = new Product({
            name,
            description,
            basePrice, // This should already be multiplied by 100 on the frontend
            category,
            subCategory,
            variations,
            images,
            isActive
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error while creating product', error: error.message });
    }
});

// Fetch all Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error while fetching products', error: error.message });
    }
});
// Fetch single Product by slug
router.get('/:slug', async (req, res) => {
    try {
        // Fallback to _id if slug is actually an ObjectId, just to be safe
        const query = req.params.slug.match(/^[0-9a-fA-F]{24}$/) 
            ? { $or: [{ slug: req.params.slug }, { _id: req.params.slug }] }
            : { slug: req.params.slug };
            
        const product = await Product.findOne(query);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error while fetching product', error: error.message });
    }
});

module.exports = router;
