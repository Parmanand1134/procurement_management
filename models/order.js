// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     status: { type: String, required: true }, // pending, completed
//     checklistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist' },
//     inspectionManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    procurementManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inspectionManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checklist: { type: mongoose.Schema.Types.ObjectId, ref: "Checklist" }, // Reference to the checklist
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
