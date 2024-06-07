const express = require("express");
const router = express.Router();
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Answer = require("../models/answer.model");
const requireAuth = require("../middleware/auth");

// get answers by question id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id }).lean();
    for (let answer of answers) {
      answer.user = await User.findById(answer.user).select("photo email");
    }
    res.json(answers);
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

// add answer
router.post("/add", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const { description, questionId } = req.body;
    const newAnswer = new Answer({
        description,
      user: user._id,
      question: questionId,
    });
    await newAnswer.save();
    user.answers.push(newAnswer._id);
    await user.save();
    console.log("Answer added!");
    res.json({ status: "OK", message: "Answer added successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
