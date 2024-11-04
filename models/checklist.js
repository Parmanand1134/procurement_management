// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//     text: { type: String, required: true },
//     answerType: { type: String, required: true }, // boolean, dropdown, multiple choice, text
//     options: { type: [String] }, // Array of options for dropdown or multiple choice
//     isRequired: { type: Boolean, default: false }
// });

// const checklistSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     questions: [questionSchema],
//     images: [{ type: String }] // URLs for uploaded images
// });

// module.exports = mongoose.model('Checklist', checklistSchema);

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answerType: {
    type: String,
    enum: ["boolean", "multiple_choice", "dropdown", "text"],
    required: true,
  },
  options: { type: [String], default: [] }, // Options for multiple choice or dropdown
  isRequired: { type: Boolean, default: true },
});

const checklistSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", checklistSchema);
