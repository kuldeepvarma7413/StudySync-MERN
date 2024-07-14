const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { isErrored } = require("nodemailer/lib/xoauth2");
const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const requireAuth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

// get user by email and account type
router.get("/", requireAuth, async (req, res) => {
  const { email, accountType } = req.user;
  try {
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

// get all users if admin requested
router.get("/all", requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role !== "admin") {
    return res.json({ status: "ERROR", message: "Unauthorized" });
  }
  try {
    const users = await User.find();
    return res.json({ status: "OK", users });
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
    let reqUser = null;

    // authentication
    var token = req.headers["authorization"];
    if (token) {
      token = token.replace("Bearer ", "");
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
          reqUser = decoded;
        }
      });
    }

    if (reqUser && reqUser._id == id) {
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
    };

    if (isUser) {
      data.questions = questions;
      data.answers = answers;
    }
    return res.json({ status: "OK", data, isUser });
  } catch (err) {
    console.error(err);
    return res.json({ status: "ERROR", message: "Server error" });
  }
});

// change password
router.post("/change-password/:id", requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.json({ status: "ERROR", message: "User not found" });
    }
    if (user.accountType !== "custom") {
      return res.json({
        status: "ERROR",
        message: "Can't set password to google account",
      });
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

// username availibility
router.post("/check-username", requireAuth, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res.json({ status: "OK", available: false });
    }
    return res.json({ status: "OK", available: true });
  } catch (err) {
    console.error(err);
    return res.json({ status: "ERROR" });
  }
});

const multer = require("multer");

const upload = multer();

// update user (name, username, profilephoto)
router.post("/update", requireAuth, upload.none(), async (req, res) => {
  const { name, username, profilePic } = req.body;
  const user = await User.findById(req.user._id);

  try {
    // validate data
    if (name == "" || username == "" || profilePic == null) {
      return res.json({ status: "ERROR", message: "All fields are required" });
    }
    // username validation by regex
    if (!/^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/.test(username)) {
      return res.json({ status: "ERROR", message: "Invalid username" });
    }

    if (user.photo != profilePic) {
      // remove previous profile photo from cloudinary if there is any
      if (user.photo) {
        const public_id =
          "profile-photos/" + user.photo.split("/").pop().split(".")[0];
        if (public_id) await cloudinary.uploader.destroy(public_id);
      }
      // upload profile photo on cloudinary
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: "profile-photos",
        public_id: `${user._id}-${Date.now()}`,
        width: 200,
        height: 200,
      });

      await User.findOneAndUpdate(
        { _id: user._id },
        { photo: result.secure_url }
      );
    }

    // update user
    await User.findOneAndUpdate(
      { _id: user._id },
      { name, username, updatedAt: Date.now() }
    );

    const updatedUser = await User.findOne({ _id: user._id });
    res.json({
      status: "OK",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", message: "Failed to update profile" });
  }
});

module.exports = router;
