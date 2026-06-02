const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "yeshiis-products" },
            (error, result) => {
                if (result) {
                    resolve({ secure_url: result.secure_url, public_id: result.public_id });
                } else {
                    reject(error);
                }
            }
        );
        stream.end(buffer);
    });
};

router.post('/upload', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No image files provided." });
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const imageResults = await Promise.all(uploadPromises);

        res.status(200).json({
            message: "Images uploaded successfully",
            images: imageResults
        });
    } catch (error) {
        console.error("Cloudinary multi-upload error:", error);
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
});

module.exports = router;