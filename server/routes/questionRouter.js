const express = require("express");
const router = express.Router();
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Answer = require("../models/answer.model");
const requireAuth = require("../middleware/auth");

// get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// get question by id
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// add question
router.post("/add", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const { title, description, tags } = req.body;
    console.log(req.body);
    const newQuestion = new Question({
      title,
      description,
      tags,
      user: user._id,
    });
    await newQuestion.save();
    console.log(newQuestion);
    user.questions.push(newQuestion._id);
    console.log(user);
    await user.save();
    console.log("Question added!");
    res.json("Question added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// update question
router.post("/update/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const { title, description, tags } = req.body;
    question.title = title;
    question.description = description;
    question.tags = tags;
    await question.save();
    res.json("Question updated!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// delete question
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const user = await User.findById(question.user);
    user.questions = user.questions.filter(
      (ques) => ques.toString() !== req.params.id
    );
    await user.save();
    await question.delete();
    res.json("Question deleted!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
