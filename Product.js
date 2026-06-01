/**
 * models/Product.js
 * ------------------
 * The core catalogue schema for Yeshii's Collection.
 *
 * KEY DESIGN DECISIONS:
 *
 * 1. VARIATION MODEL (variations[])
 *    Instead of two separate arrays for size and color, each
 *    variation is a self-contained document: { size, color, stockCount, sku }.
 *    This makes stock updates atomic and avoids the N×M index problem
 *    (e.g., finding "M / Black" is a single array lookup, not two).
 *
 * 2. IMAGES (images[])
 *    Stores both secure_url (for rendering) and public_id (for deletion).
 *    The order of items in the array represents display order — index 0
 *    is treated as the primary/hero image.
 *
 * 3. SOFT DELETE (isActive)
 *    Products are never hard-deleted from the DB. Setting isActive: false
 *    hides them from the storefront while preserving order history integrity.
 */

const mongoose = require("mongoose");

// ─── Sub-document: Product Image ──────────────────────────────────────────
const imageSchema = new mongoose.Schema(
  {
    /** Full HTTPS URL returned by Cloudinary — use this in <img> tags */
    secure_url: {
      type: String,
      required: [true, "Image secure_url is required."],
    },
    /** Cloudinary asset identifier — required to delete or transform the asset */
    public_id: {
      type: String,
      required: [true, "Image public_id is required."],
    },
  },
  { _id: true } // keep _id so the client can reference individual images
);

// ─── Sub-document: Product Variation ──────────────────────────────────────
const variationSchema = new mongoose.Schema(
  {
    /** Standardised size label. Add to enum as the catalogue grows. */
    size: {
      type: String,
      enum: {
        values: ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE",
                 // Shoe sizes (EU)
                 "35", "36", "37", "38", "39", "40", "41", "42"],
        message: "'{VALUE}' is not a valid size.",
      },
      required: [true, "Variation size is required."],
    },
    /** Colour name — free-text to support brand-specific names like 'Bone' or 'Noir' */
    color: {
      type: String,
      required: [true, "Variation color is required."],
      trim: true,
      maxlength: [50, "Color name cannot exceed 50 characters."],
    },
    /** Units available for this specific size+color combination */
    stockCount: {
      type: Number,
      required: [true, "Stock count is required."],
      min: [0, "Stock count cannot be negative."],
      default: 0,
    },
    /**
     * Optional SKU for WMS / warehouse integration.
     * Pattern: YESHII-{CATEGORY_CODE}-{SIZE}-{COLOR_CODE}-{SEQUENCE}
     * e.g. YESHII-APR-M-BLK-001
     */
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true, // allows multiple null values (not all products will have SKUs initially)
    },
  },
  { _id: true }
);

// ─── Main Schema: Product ─────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters."],
    },

    /** Rich text / markdown supported — the client is responsible for sanitisation */
    description: {
      type: String,
      required: [true, "Product description is required."],
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },

    category: {
      type: String,
      required: [true, "Category is required."],
      enum: {
        values: ["Apparel", "Shoes"],
        message: "Category must be either 'Apparel' or 'Shoes'.",
      },
    },

    /** Price in the smallest currency unit (e.g., NPR paisa or USD cents)
     *  to avoid floating-point arithmetic errors in calculations.
     *  DISPLAY: divide by 100 on the client.
     */
    basePrice: {
      type: Number,
      required: [true, "Base price is required."],
      min: [0, "Price cannot be negative."],
    },

    /** Array of Cloudinary image assets. Index 0 = hero/primary image. */
    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "A product cannot have more than 10 images.",
      },
      default: [],
    },

    /** Each entry represents one purchasable size+color combination */
    variations: {
      type: [variationSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A product must have at least one variation.",
      },
    },

    /** Computed helper — true if any variation has stockCount > 0 */
    inStock: {
      type: Boolean,
      default: true,
    },

    /** False = hidden from storefront but preserved in DB for order history */
    isActive: {
      type: Boolean,
      default: true,
      index: true, // frequently filtered — worth indexing
    },

    /** URL-friendly identifier, auto-generated from name if not provided */
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
productSchema.index({ category: 1, isActive: 1 }); // storefront listing queries
productSchema.index({ "variations.sku": 1 }, { sparse: true }); // WMS lookups

// ─── Pre-save Hooks ───────────────────────────────────────────────────────

/** Auto-generate slug from name if not manually set */
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

/** Keep the computed inStock flag in sync whenever variations change */
productSchema.pre("save", function (next) {
  if (this.isModified("variations")) {
    this.inStock = this.variations.some((v) => v.stockCount > 0);
  }
  next();
});

// ─── Virtuals ─────────────────────────────────────────────────────────────

/** Convenience: total units across all variations */
productSchema.virtual("totalStock").get(function () {
  return this.variations.reduce((sum, v) => sum + v.stockCount, 0);
});

// ─── Model Export ─────────────────────────────────────────────────────────
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
