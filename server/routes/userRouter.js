const express = require("express");
const router = express.Router();

const Question = require("../models/question.model");
const User = require("../models/user.model");
const Answer = require("../models/answer.model");
const requireAuth = require("../middleware/auth");

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    console.log("hii");
    const user = await User.findById(req.params.id);
    res.json({ status: "OK", user });
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
