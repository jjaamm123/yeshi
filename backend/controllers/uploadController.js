const cloudinary = require('../config/cloudinary');

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'yeshi_collection' },
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        }
    );

    uploadStream.end(req.file.buffer);
};

module.exports = { uploadImage };
