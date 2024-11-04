const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["admin", "procurement_manager", "inspection_manager", "client"],
  },
});

module.exports = mongoose.model("Role", roleSchema);
