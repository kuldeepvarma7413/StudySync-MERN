const mongoose = require("mongoose");

const Report = new mongoose.Schema({
  subject: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bugOrFeature: { type: String, required: true },
  description: { type: String, required: true },
});

const model = mongoose.model("Report", Report);

module.exports = model;
