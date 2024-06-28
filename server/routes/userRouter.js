const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isErrored } = require("nodemailer/lib/xoauth2");
const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const requireAuth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// get user by email and account type
router.get("/", requireAuth, async (req, res) => {
  const { email, accountType } = req.query;
  try {
    console.log(email, accountType);
    const user = await User.findOne({ email: email, accountType: accountType });
    if (!user) {
      return res.json({ status: "ERROR", message: "User not found" });
    }
    return res.json({ status: "OK", user });
  } catch (err) {
    console.error(err);
    return res.json({ status: "ERROR", message: "Server error" });
  }
});

// get user by id
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ status: "ERROR", message: "User not found" });
    }
    // calculate total upvotes on question and answers
    let totalUpvotes = 0;
    for (var i = 0; i < user.questions.length; i++) {
      const question = await Question.findById(user.questions[i]._id);
      totalUpvotes += question.upvotes.length;
    }
    for (var i = 0; i < user.answers.length; i++) {
      const answer = await Answer.findById(user.answers[i]._id);
      totalUpvotes += answer.upvotes.length;
    }

    // all questions
    const questions = await Question.find({ user: id });

    // all answers
    let answers = await Answer.find({ user: id });

    let isUser = false;
    if(req.user._id == id){
      isUser = true;
    }

    const data = {
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.photo,
      totalQuestions: questions.length,
      totalAnswers: answers.length,
      totalUpvotes,
      status: user.isDeleted ? "Deleted" : "Active",
      lastUpdated: user.updatedAt,
      createdAt: user.createdAt,
      questions: questions,
      answers: answers,
    };
    return res.json({ status: "OK", data, isUser });
  } catch (err) {
    console.error(err);
    return res.json({ status: "ERROR", message: "Server error" });
  }
});


// change password
router.post("/change-password/:id", requireAuth, async (req, res) => {
  console.log("id ",req.params.id);
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.json({ status: "ERROR", message: "User not found" });
    }
    if(user.accountType !== "custom"){
      return res.json({ status: "ERROR", message: "Can't set password to google account" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ status: "ERROR", message: "Invalid old password" });
    }
    // check password should not be same as previous password
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.json({
        status: "ERROR",
        message: "Password should not be same as previous password",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword }
    );
    res.json({ status: "OK", message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", message: "Failed to update password" });
  }
});


module.exports = router;
