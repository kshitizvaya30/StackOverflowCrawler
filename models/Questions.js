const mongoose = require("mongoose");

/**
 * Question model schema.
 */
const questionsSchema = new mongoose.Schema({
  url: { type: String, required: true },
  votes: { type: Number, required: true, default: 0 },
  answers: { type: Number, required: true, default: 0 },
  views: { type: String, required: true, default: 0 },
  count: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model("questions", questionsSchema);
