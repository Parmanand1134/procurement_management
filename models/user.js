// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     role: { type: String, required: true },
//     mobile: { type: String } // For inspection manager
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  //   role: {
  //     type: String,
  //     required: true,
  //     enum: ["admin", "procurement_manager", "inspection_manager", "client"],
  //   },
  mobile: { type: String }, // Only for inspection managers
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
