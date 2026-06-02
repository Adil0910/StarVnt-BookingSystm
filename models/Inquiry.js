const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    clientEmail: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);