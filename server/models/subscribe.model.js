const mongoose = require("mongoose");

const Subscribe = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
});

const model = mongoose.model("Subscribe", Subscribe);

module.exports = model;
