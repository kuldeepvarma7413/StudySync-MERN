const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isErrored } = require("nodemailer/lib/xoauth2");

// get user by email and account type
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({ status: "ERROR", message: "User not found" });
    }
    // calculate total upvotes on question and answers
    let totalUpvotes = 0;
    for(var i = 0; i < user.questions.length; i++){
      totalUpvotes += user.questions[i].upvotes.length;
    }
    for(var i = 0; i < user.answers.length; i++){
      totalUpvotes += user.answers[i].upvotes.length;
    }
    const data = {
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.photo,
      totalQuestions: user.questions.length,
      totalAnswers: user.answers.length,
      totalUpvotes,
      status: user.isDeleted ? "Deleted" : "Active",
      lastUpdated: user.updatedAt,
    };
    return res.json({ status: "OK", data });
  } catch (err) {
    console.error(err);
    return res.json({ status: "ERROR", message: "Server error" });
  }
});

module.exports = router;
