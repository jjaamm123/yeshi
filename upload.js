/**
 * middleware/upload.js
 * ---------------------
 * Configures Multer to use in-memory storage (MemoryStorage).
 *
 * WHY MEMORY STORAGE?
 * We stream the file buffer directly to Cloudinary via a upload_stream,
 * so we never write temporary files to disk. This is safer and faster
 * in containerized / serverless environments.
 *
 * USAGE (in a protected admin route):
 *   router.post('/products/:id/images', protect, isAdmin, upload.array('images', 5), uploadImages);
 *
 * The field name 'images' must match the FormData key the client sends.
 * The second argument (5) is the max number of files per request.
 */

const multer = require("multer");

// ─── Allowed MIME Types ────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

// ─── File Filter ──────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP are allowed.`
      ),
      false
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024, // convert MB to bytes
    files: 5, // hard cap: max 5 images per upload request
  },
  fileFilter,
});

module.exports = upload;
