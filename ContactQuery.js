/**
 * models/ContactQuery.js
 * -----------------------
 * Stores inbound customer messages from the storefront's "Contact Us" page.
 *
 * Intentionally lightweight — this is an internal triage tool, not a CRM.
 * Messages are marked read/unread by the admin and can be archived.
 */

const mongoose = require("mongoose");

const contactQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },

    /** The customer's message body */
    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
      minlength: [10, "Message must be at least 10 characters."],
      maxlength: [2000, "Message cannot exceed 2000 characters."],
    },

    /**
     * Triage status — managed by admin.
     * 'unread'  → new, not yet seen
     * 'read'    → opened by admin
     * 'archived'→ resolved / no action needed
     */
    status: {
      type: String,
      enum: {
        values: ["unread", "read", "archived"],
        message: "'{VALUE}' is not a valid status.",
      },
      default: "unread",
      index: true,
    },

    /** Optional: admin reply notes — internal only, not sent to the customer */
    adminNote: {
      type: String,
      trim: true,
      maxlength: [500, "Admin note cannot exceed 500 characters."],
    },
  },
  {
    timestamps: true, // createdAt = when the message was submitted
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────
contactQuerySchema.index({ status: 1, createdAt: -1 }); // admin inbox: unread first
contactQuerySchema.index({ email: 1 });                  // look up by customer email

// ─── Model Export ─────────────────────────────────────────────────────────
const ContactQuery = mongoose.model("ContactQuery", contactQuerySchema);
module.exports = ContactQuery;
