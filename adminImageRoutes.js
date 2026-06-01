/**
 * routes/adminImageRoutes.js
 * ---------------------------
 * Wires together the upload middleware, Multer, and the image controller
 * for the protected admin panel. Import this into your main Express app.
 *
 * ASSUMED MIDDLEWARE (not defined here):
 *   - protect     → validates JWT, attaches req.user
 *   - isAdmin     → checks req.user.role === 'admin'
 *
 * USAGE IN app.js / server.js:
 *   const adminImageRoutes = require('./routes/adminImageRoutes');
 *   app.use('/api/admin/products', adminImageRoutes);
 */

const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadProductImages, deleteProductImage } = require("../controllers/imageController");

// Placeholder guards — replace with your actual auth middleware
const protect = (req, res, next) => next();   // TODO: implement JWT verification
const isAdmin = (req, res, next) => next();   // TODO: implement role check

/**
 * POST /api/admin/products/:productId/images
 *
 * Middleware chain:
 *  1. protect          → authenticate the request
 *  2. isAdmin          → authorise admin role
 *  3. upload.array()   → parse multipart/form-data, buffer files in memory
 *  4. uploadProductImages → stream each buffer to Cloudinary, save URLs to DB
 *
 * Client sends: FormData with key 'images' containing 1–5 image files.
 */
router.post(
  "/:productId/images",
  protect,
  isAdmin,
  upload.array("images", 5),
  uploadProductImages
);

/**
 * DELETE /api/admin/products/:productId/images/:publicId
 *
 * The :publicId segment must be URL-encoded on the client because
 * Cloudinary public IDs contain forward slashes.
 * e.g. encodeURIComponent("yeshii/products/123/1700000000000-front")
 */
router.delete(
  "/:productId/images/:publicId",
  protect,
  isAdmin,
  deleteProductImage
);

module.exports = router;
