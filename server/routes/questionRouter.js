const express = require("express");
const router = express.Router();
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Answer = require("../models/answer.model");
const requireAuth = require("../middleware/auth");

// get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().lean();

    for (let question of questions) {
      question.user = await User.findById(question.user).select(
        "photo email username"
      );
      question.answers = await Answer.find({ question: question._id });
    }

    res.json({ status: "OK", data: questions });
  } catch (err) {
    console.log(err);
    res.json({ status: "ERROR", message: "Failed to fetch questions" });
  }
});

// get question by id
router.get("/:id", async (req, res) => {
  try {
    let question = await Question.findById(req.params.id).lean();
    // increase views count
    question.views += 1;
    await Question.findByIdAndUpdate(req.params.id, { views: question.views });

    question.user = await User.findById(question.user).select(
      "photo email username"
    );
    question.answers = await Answer.find({ question: question._id });

    res.json(question);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// add question
router.post("/add", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const { title, description, tag } = req.body;
    const tags = tag.split(",");
    const newQuestion = new Question({
      title,
      description,
      tags,
      user: user._id,
    });
    await newQuestion.save();
    user.questions.push(newQuestion._id);
    await user.save();
    res.json({ status: "OK", message: "Question added successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

// upvote question
router.post("/addvote/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });
    // console.log(question, user);
    if (!question.upvotes.includes(user._id)) {
      question.upvotes.push(user._id);
      await question.save();
    } else {
      return res.json({ status: "OK", message: "Already upvoted!" });
    }
    return res.json({ status: "OK", message: "Upvoted!" });
  } catch (err) {
    return res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// downvote question
router.post("/removevote/:id", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });

    if (question.upvotes.includes(user._id)) {
      question.upvotes = question.upvotes.filter(
        (upvote) => upvote.toString() !== user._id.toString()
      );
      await question.save();
    } else {
      return res.json({ status: "OK", message: "Not voted yet!" });
    }
    res.json({ status: "OK", message: "Upvote removed!" });
  } catch (err) {
    res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// update question
// router.post("/update/:id", requireAuth, async (req, res) => {
//   try {
//     const question = await Question.findById(req.params.id);
//     const { title, description, tags } = req.body;
//     question.title = title;
//     question.description = description;
//     question.tags = tags;
//     await question.save();
//     res.json("Question updated!");
//   } catch (err) {
//     res.status(400).json("Error: " + err);
//   }
// });

// delete question
router.delete("/delete/:id", requireAuth, async (req, res) => {
  try {
    // admin access
    const reqUser = await User.findById(req.user._id);
    if (reqUser.role !== "admin") {
      return res.json({ status: "ERROR", message: "Unauthorized" });
    }
    const question = await Question.findById(req.params.id);
    const user = await User.findById(question.user);
    user.questions = user.questions.filter(
      (ques) => ques.toString() !== question._id.toString()
    );
    // delete all answers too
    await Answer.deleteMany({ question: req.params.id });
    await user.save();
    await Question.findByIdAndDelete(req.params.id);
    res.json({ status: "OK", message: "Question deleted successfully" });
  } catch (err) {
    console.log(err);
    res.json({ status: "ERROR", message: "Failed to delete question" });
  }
});

module.exports = router;
