require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token.model");
const { OAuth2Client } = require("google-auth-library");
const { url } = require("inspector");

// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // Destructure request body

  try {
    let existingUser = await User.findOne({ email }); // Check for existing user
    if (existingUser) {
      return res.json({ status: "ERROR", error: "Duplicate email found" });
    }

    // Hash password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust cost factor as needed

    let user = await User.create({ name, email, password: hashedPassword, accountType: "custom" }); // Create new user

    const token = new Token({
      user: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    }); // Generate token
    await token.save();
    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`; // Verification link

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${url}`,
    }); // Send verification email

    res.json({
      status: "OK",
      message: "Verification Email sent successfully, Please Verify.",
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: "ERROR", error: "Registration failed" }); // Generic error message
  }
});

// Verification route
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User not found" });
    }
    const token = await Token.findOne({
      token: req.params.token,
      user: user._id,
    });
    if (!token) {
      return res.status(400).json({ message: "Invalid or Expired Link" });
    }

    await User.findOneAndUpdate({ _id: user._id }, { verified: true });
    await Token.deleteOne({ _id: token._id });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "ERROR", error: "Failed to verify email" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure request body

  try {
    const user = await User.findOne({ email: email, accountType: "custom", isDeleted: false }); // Find user by email

    if (!user) {
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found" });
    }

    // Compare password hashes using bcrypt
    const isMatch = await bcrypt.compare(password, user.password); // Replace with actual password validation logic

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Invalid credentials" });
    }

    if (!user.verified) {
      let token = await Token.findOne({ user: user._id });
      if (!token) {
        const token = new Token({
          user: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        }); // Generate token
        await token.save();
        const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
        await sendEmail({
          email: user.email,
          subject: "Verify your email",
          text: `Click this link to verify your email: ${url}`,
        }); // Send verification email
      }
      return res.json({
        status: "ERROR",
        message: "Verification Email sent successfully, Please Verify.",
      });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email, accountType: user.accountType},
      process.env.JWT_SECRET
    ); // Generate JWT
    res.json({ status: "OK", token, user, message: "User logged in successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: "ERROR", error: "Login failed" }); // Generic error message
  }
});

// google auth

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.REACT_APP_BACKEND_URL}/auth`
});

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`
  );
  return await response.json();
}

router.get("/", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await oAuth2Client.getToken(code);

    await oAuth2Client.setCredentials(response.tokens);
    console.log("token acquired");

    const GoogleUser = oAuth2Client.credentials;

    const userData = await getUserData(GoogleUser.access_token);
    console.log(userData)
    // check if user exists
    const user = await User.findOne({ email: userData.email, accountType: "google", isDeleted: false });
    if (!user) {
      // create user
      let newUser = await User.create({ name: userData.name, email: userData.email, accountType: "google", verified: true, photo: userData.picture});
      const token = jwt.sign(
        { name: newUser.name, email: newUser.email, accountType: newUser.accountType},
        process.env.JWT_SECRET
      );
      return res.redirect(`${process.env.BASE_URL}/google-auth-success/${token}`);
    }else{
        const token = jwt.sign(
          { name: user.name, email: user.email, accountType: user.accountType},
          process.env.JWT_SECRET
          ); // Generate JWT
      return res.redirect(`${process.env.BASE_URL}/google-auth-success/${token}`);
    }
  } catch (err) {
    console.log("Error with signing in with google " + err);
  }
});

module.exports = router; // Export the router for use in the main app
