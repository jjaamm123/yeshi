/**
 * models/Order.js
 * ----------------
 * Captures a customer purchase with full denormalisation of product
 * details at time of order, plus Stripe payment tracking.
 *
 * KEY DESIGN DECISIONS:
 *
 * 1. SNAPSHOT PATTERN (orderItems[].snapshot)
 *    We store a snapshot of the product name and price at order time.
 *    This prevents historical orders from being corrupted if a product's
 *    name or price is later updated.
 *
 * 2. STRIPE PAYMENT INTENT
 *    We store the paymentIntentId (created by your backend before checkout)
 *    and the paymentStatus (updated via Stripe webhooks). These are separate
 *    from the order status to clearly separate fulfilment from payment state.
 *
 * 3. STATUS PROGRESSION
 *    Pending → Processing → Shipped
 *    Transitions are enforced at the service layer, not the schema layer.
 */

const mongoose = require("mongoose");

// ─── Sub-document: Shipping Address ──────────────────────────────────────
const shippingAddressSchema = new mongoose.Schema(
  {
    fullName:   { type: String, required: true, trim: true },
    line1:      { type: String, required: true, trim: true },  // street address
    line2:      { type: String, trim: true },                  // apartment, suite, etc.
    city:       { type: String, required: true, trim: true },
    state:      { type: String, trim: true },                  // province / district
    postalCode: { type: String, required: true, trim: true },
    country:    { type: String, required: true, trim: true, default: "Nepal" },
    phone:      { type: String, trim: true },
  },
  { _id: false } // embedded address, no need for its own _id
);

// ─── Sub-document: Order Line Item ───────────────────────────────────────
const orderItemSchema = new mongoose.Schema(
  {
    /** Reference to the live Product document (for admin drill-downs) */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order item must reference a product."],
    },

    /** Specific variation purchased — must match an _id in Product.variations[] */
    variationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Order item must specify a variation."],
    },

    /** Denormalised variation details — frozen at order time */
    size:  { type: String, required: true },
    color: { type: String, required: true },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1."],
    },

    /**
     * Snapshot of data at the moment of purchase.
     * Protects order history from future product edits.
     */
    snapshot: {
      name:      { type: String, required: true }, // product name at time of order
      imageUrl:  { type: String },                 // hero image URL at time of order
      unitPrice: { type: Number, required: true }, // price in smallest currency unit
    },
  },
  { _id: true }
);

// ─── Sub-document: Customer Info ─────────────────────────────────────────
const customerInfoSchema = new mongoose.Schema(
  {
    /** Customer's email — required even for guest checkout */
    email: {
      type: String,
      required: [true, "Customer email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    /** Optional: populate if you add user authentication later */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

// ─── Main Schema: Order ───────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: customerInfoSchema,
      required: true,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required."],
    },

    orderItems: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    /**
     * Fulfilment status — reflects physical/logistics state.
     * Updated by admin; Shipped triggers a customer email notification.
     */
    status: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Shipped"],
        message: "'{VALUE}' is not a valid order status.",
      },
      default: "Pending",
      index: true,
    },

    // ── Stripe Payment Fields ──────────────────────────────────────────
    /**
     * Created by your backend (stripe.paymentIntents.create) before
     * the client renders the Stripe Elements form.
     */
    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true, // null-safe unique index
      index: true,
    },

    /**
     * Mirrors the Stripe PaymentIntent status.
     * Updated exclusively via Stripe webhooks — do not set this manually.
     * https://stripe.com/docs/payments/intents#intent-statuses
     */
    paymentStatus: {
      type: String,
      enum: ["requires_payment_method", "requires_confirmation",
             "requires_action", "processing", "succeeded",
             "requires_capture", "canceled"],
      default: "requires_payment_method",
    },

    // ── Pricing Summary ───────────────────────────────────────────────
    /** Subtotal of all line items (unitPrice × quantity), in smallest currency unit */
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    /** Shipping cost, in smallest currency unit. 0 = free shipping. */
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    /** subtotal + shippingCost — stored explicitly for reporting queries */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /** Free-text internal notes — visible to admin only, never the customer */
    adminNotes: {
      type: String,
      maxlength: [500, "Admin notes cannot exceed 500 characters."],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
orderSchema.index({ "customer.email": 1 });      // look up orders by customer email
orderSchema.index({ createdAt: -1 });             // admin dashboard: sort by newest
orderSchema.index({ status: 1, createdAt: -1 }); // filter by status + sort

// ─── Virtuals ─────────────────────────────────────────────────────────────

/** Human-readable order reference, e.g. "ORD-507f1f77" */
orderSchema.virtual("orderRef").get(function () {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// ─── Model Export ─────────────────────────────────────────────────────────
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
