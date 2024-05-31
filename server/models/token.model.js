const mongoose = require("mongoose");

const Token = new mongoose.Schema({
  token: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  createdAt: { type: Date, expires: 3600, default: Date.now() },
});

const model = mongoose.model("Token", Token);

module.exports = model;
