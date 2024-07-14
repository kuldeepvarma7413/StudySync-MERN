const express = require("express");
const router = express.Router();
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Answer = require("../models/answer.model");
const requireAuth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");

// get all answers
router.get("/", requireAuth, async (req, res) => {
  try {
    const answers = await Answer.find().lean();
    for (let answer of answers) {
      answer.user = await User.findById(answer.user).select(
        "photo email username"
      );
    }
    res.json({ status: "OK", data: answers });
  } catch (err) {
    console.log(err);
    res.json({ status: "ERROR", message: "Failed to fetch answers" });
  }
});

// get answers by question id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.id }).lean();
    for (let answer of answers) {
      answer.user = await User.findById(answer.user).select(
        "photo email username"
      );
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
    // send mail to user
    const question = await Question.findById(questionId).lean();
    question.user = await User.findById(question.user).select("email username name");
    await sendEmail({
      email: question.user.email,
      subject: "New Answer",
      text: `Hello ${question.user.name},\n\nYour question has been answered by ${user.name}.\n
      Click here ${process.env.BASE_URL}/discuss/view-question/${questionId}\n\nThanks,\nTeam StudySync`,
    });

    res.json({ status: "OK", message: "Answer added successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "ERROR", error: "Failed to add answer" });
  }
});

// upvote answer
router.post("/addvote/:id", requireAuth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });
    // add vote in answer
    if (!answer.upvotes.includes(user._id)) {
      answer.upvotes.push(user._id);
      await answer.save();
    } else {
      return res.json({ status: "OK", message: "Already upvoted!" });
    }

    return res.json({ status: "OK", message: "Upvoted answer successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: "ERROR", error: "Failed to upvote answer" });
  }
});

// downvote answer
router.post("/removevote/:id", requireAuth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });

    // remove vote from answer
    if (answer.upvotes.includes(user._id)) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== user._id.toString()
      );
      await answer.save();
    } else {
      return res.json({ status: "OK", message: "Not voted yet!" });
    }

    return res.json({ status: "OK", message: "Upvote removed!" });
  } catch (err) {
    return res.status(400).json({ status: "ERROR", message: "Error: " + err });
  }
});

// delete answer
router.delete("/delete/:id", requireAuth, async (req, res) => {
  try {
    // admin access
    const reqUser = await User.findById(req.user._id);
    if (reqUser.role !== "admin") {
      return res.json({ status: "ERROR", message: "Unauthorized access" });
    }
    const answer = await Answer.findById(req.params.id);
    const user = await User.findById(answer.user);
    user.answers = user.answers.filter(
      (id) => id.toString() !== answer._id.toString()
    );
    await user.save();
    await Answer.findByIdAndDelete(req.params.id);

    res.json({ status: "OK", message: "Answer deleted successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ status: "ERROR", message: "Failed to delete answer" });
  }
});

module.exports = router;
