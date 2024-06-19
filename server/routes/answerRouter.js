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

// upvote answer
router.post("/addvote/:id", requireAuth, async (req, res) => {
  console.log(req.params.id, req.user.email);
  try {
    const answer = await Answer.findById(req.params.id);
    const user = await User.findOne({ email: req.user.email });
    // console.log(user, answer);
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
  console.log(req.params.id, req.user.email);
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

module.exports = router;
