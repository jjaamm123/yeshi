/**
 * config/cloudinary.js
 * ---------------------
 * Initializes and exports the configured Cloudinary SDK instance.
 * All Cloudinary operations (upload, destroy) should import from here
 * to guarantee a single, consistent configuration across the app.
 */

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // always return https secure_url
});

module.exports = cloudinary;
