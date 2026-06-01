/**
 * controllers/imageController.js
 * --------------------------------
 * Handles all Cloudinary image operations for the Admin panel.
 *
 * Exported controllers:
 *  - uploadProductImages  → POST  /api/admin/products/:productId/images
 *  - deleteProductImage   → DELETE /api/admin/products/:productId/images/:publicId
 *
 * Assumes the following middleware chain on the route:
 *   protect → isAdmin → upload.array('images', 5) → controller
 */

const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Uploads a single file buffer to Cloudinary via upload_stream.
 * Returns a Promise that resolves with the Cloudinary UploadApiResponse.
 *
 * @param {Buffer}  buffer   - The raw file buffer from Multer MemoryStorage
 * @param {string}  folder   - Destination folder inside Cloudinary
 * @param {string}  filename - Public ID (used for organised, predictable URLs)
 */
const streamUpload = (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        // Yeshii's monochromatic brand — desaturate on upload as a safety net,
        // but keep originals for CMS flexibility via named transformations.
        transformation: [
          { quality: "auto:good" }, // smart compression
          { fetch_format: "auto" }, // serve WebP/AVIF to capable browsers
        ],
        resource_type: "image",
        overwrite: false,     // never silently overwrite; use explicit public_id changes
        invalidate: true,     // purge CDN cache when an image is replaced
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Builds a deterministic public_id.
 * Pattern: yeshii/products/{productId}/{timestamp}-{originalName}
 * This keeps assets organised in Cloudinary's Media Library.
 */
const buildPublicId = (productId, originalname) => {
  const sanitised = originalname
    .replace(/\.[^/.]+$/, "")           // strip extension (Cloudinary adds it)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")         // replace non-alphanumeric with dashes
    .replace(/-+/g, "-")                 // collapse consecutive dashes
    .slice(0, 60);                        // cap length

  return `${Date.now()}-${sanitised}`;
};

// ─── Controllers ──────────────────────────────────────────────────────────

/**
 * @desc    Upload one or more product images to Cloudinary and
 *          append the results to the product's images array.
 * @route   POST /api/admin/products/:productId/images
 * @access  Private/Admin
 * @body    FormData with field name 'images' (1–5 files)
 */
const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Guard: files must be present (Multer populates req.files)
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No image files provided." });
    }

    // 2. Guard: product must exist before we waste Cloudinary bandwidth
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // 3. Upload each file buffer concurrently for speed
    const folder = `yeshii/products/${productId}`;

    const uploadPromises = req.files.map((file) => {
      const publicId = buildPublicId(productId, file.originalname);
      return streamUpload(file.buffer, folder, publicId);
    });

    const uploadResults = await Promise.all(uploadPromises);

    // 4. Map Cloudinary results → our image sub-document shape
    const newImages = uploadResults.map((result) => ({
      secure_url: result.secure_url,
      public_id: result.public_id,
    }));

    // 5. Append to the product and save
    product.images.push(...newImages);
    await product.save();

    res.status(200).json({
      success: true,
      message: `${newImages.length} image(s) uploaded successfully.`,
      images: product.images, // return the full updated array
    });
  } catch (error) {
    console.error("[uploadProductImages]", error);
    res.status(500).json({ success: false, message: "Image upload failed.", error: error.message });
  }
};

/**
 * @desc    Delete a single product image from Cloudinary and
 *          remove it from the product's images array.
 * @route   DELETE /api/admin/products/:productId/images/:publicId
 * @access  Private/Admin
 *
 * NOTE: The publicId in the URL must be URL-encoded since it contains slashes.
 *       On the client: encodeURIComponent(image.public_id)
 */
const deleteProductImage = async (req, res) => {
  try {
    const { productId, publicId } = req.params;

    // Decode the public_id (it contains forward slashes which are URL-encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    // 1. Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // 2. Confirm the image belongs to this product (prevents cross-product deletion)
    const imageExists = product.images.some((img) => img.public_id === decodedPublicId);
    if (!imageExists) {
      return res.status(404).json({ success: false, message: "Image not found on this product." });
    }

    // 3. Delete from Cloudinary first — if this fails, we don't corrupt the DB
    await cloudinary.uploader.destroy(decodedPublicId, { invalidate: true });

    // 4. Remove from the product's images array using MongoDB $pull
    product.images = product.images.filter((img) => img.public_id !== decodedPublicId);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
      images: product.images,
    });
  } catch (error) {
    console.error("[deleteProductImage]", error);
    res.status(500).json({ success: false, message: "Image deletion failed.", error: error.message });
  }
};

module.exports = { uploadProductImages, deleteProductImage };
