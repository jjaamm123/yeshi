import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js'; // Adjust path if necessary

dotenv.config();

// Standard high-contrast placeholder for the Editorial Maximalist aesthetic
const placeholderImg = {
    secure_url: 'https://via.placeholder.com/600x800/000000/FFFFFF?text=Yeshiis+Editorial',
    public_id: 'seed_placeholder'
};

const seedProducts = [
    // --- APPAREL ---
    {
        name: 'Oversized Crisp Cotton Shirt',
        description: 'A wardrobe staple. This ultra-soft, breathable cotton shirt features a relaxed, oversized fit, a sharp collar, and subtle drop shoulders.',
        basePrice: 250000, // 2500 NPR
        category: 'Apparel',
        subCategory: 'Tops',
        variations: [
            { size: 'S', color: 'White', stockCount: 15 },
            { size: 'M', color: 'White', stockCount: 20 },
            { size: 'L', color: 'Black', stockCount: 10 }
        ],
        images: [placeholderImg, placeholderImg],
        isActive: true
    },
    {
        name: 'Tailored Linen Wide-Leg Trousers',
        description: 'High-waisted and impeccably tailored. Crafted from premium breathable linen, featuring a seamless front zip and brutalist pleat detailing.',
        basePrice: 320000, // 3200 NPR
        category: 'Apparel',
        subCategory: 'Bottoms',
        variations: [
            { size: 'M', color: 'Black', stockCount: 12 },
            { size: 'L', color: 'Black', stockCount: 8 }
        ],
        images: [placeholderImg],
        isActive: true
    },
    {
        name: 'Ribbed Knit Midi Slip',
        description: 'Form-fitting yet fluid. This ribbed knit midi dress hugs the silhouette with a subtle stretch. Features a severe square neckline.',
        basePrice: 380000, // 3800 NPR
        category: 'Apparel',
        subCategory: 'Dresses',
        variations: [
            { size: 'S', color: 'Black', stockCount: 10 },
            { size: 'M', color: 'Black', stockCount: 15 }
        ],
        images: [placeholderImg, placeholderImg],
        isActive: true
    },
    {
        name: 'Seamless Silk Bralette',
        description: 'The foundation of minimalist layering. A wire-free silk bralette offering light support and an invisible profile under sheer garments.',
        basePrice: 180000, // 1800 NPR
        category: 'Apparel',
        subCategory: 'Innerwear',
        variations: [
            { size: 'S', color: 'White', stockCount: 25 },
            { size: 'M', color: 'Black', stockCount: 30 }
        ],
        images: [placeholderImg],
        isActive: true
    },
    {
        name: 'Structured Wool Trench Coat',
        description: 'An architectural masterpiece. An ankle-length trench coat crafted from heavy wool blend, featuring exaggerated lapels and a belted waist.',
        basePrice: 1250000, // 12500 NPR
        category: 'Apparel',
        subCategory: 'Outerwear',
        variations: [
            { size: 'M', color: 'Charcoal', stockCount: 5 },
            { size: 'L', color: 'Charcoal', stockCount: 3 }
        ],
        images: [placeholderImg, placeholderImg],
        isActive: true
    },

    // --- SHOES ---
    {
        name: 'Minimalist Leather Trainers',
        description: 'Elevated streetwear. Stark white trainers with a chunky monochromatic sole and premium calf-leather upper.',
        basePrice: 550000, // 5500 NPR
        category: 'Shoes',
        subCategory: 'Sneakers',
        variations: [
            { size: '38', color: 'White', stockCount: 10 },
            { size: '39', color: 'White', stockCount: 12 },
            { size: '40', color: 'Black', stockCount: 8 }
        ],
        images: [placeholderImg],
        isActive: true
    },
    {
        name: 'Pointed-Toe Leather Mules',
        description: 'The ultimate slip-on flat. Crafted from smooth, matte faux-leather with a razor-sharp pointed toe.',
        basePrice: 450000, // 4500 NPR
        category: 'Shoes',
        subCategory: 'Flats',
        variations: [
            { size: '37', color: 'Black', stockCount: 5 },
            { size: '38', color: 'Black', stockCount: 10 }
        ],
        images: [placeholderImg],
        isActive: true
    },
    {
        name: 'Architectural Block Heels',
        description: 'A 3-inch block heel designed for stability without sacrificing aesthetic severity. Features a square toe and thin ankle strap.',
        basePrice: 620000, // 6200 NPR
        category: 'Shoes',
        subCategory: 'Heels',
        variations: [
            { size: '38', color: 'Black', stockCount: 6 },
            { size: '39', color: 'White', stockCount: 4 }
        ],
        images: [placeholderImg, placeholderImg],
        isActive: true
    },
    {
        name: 'Chunky Platform Chelsea Boots',
        description: 'Aggressive and utilitarian. A pull-on boot featuring elastic gussets and a massive 2-inch ridged platform sole.',
        basePrice: 850000, // 8500 NPR
        category: 'Shoes',
        subCategory: 'Boots',
        variations: [
            { size: '39', color: 'Black', stockCount: 8 },
            { size: '40', color: 'Black', stockCount: 7 }
        ],
        images: [placeholderImg],
        isActive: true
    }
];

const injectData = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yeshiis-collection');
        console.log('MongoDB Connected for Seeding...');

        // Clear existing database to prevent duplicates
        await Product.deleteMany({});
        console.log('Old products cleared.');

        // Insert the new complete catalog
        await Product.insertMany(seedProducts);
        console.log('Data injection successful! 9 high-end products added across all categories.');

        process.exit();
    } catch (error) {
        console.error('Data injection failed:', error);
        process.exit(1);
    }
};

injectData();