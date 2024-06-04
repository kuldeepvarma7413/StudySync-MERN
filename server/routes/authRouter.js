require("dotenv").config(); // Load environment variables from the .env file
const express = require("express");
const router = express.Router(); // Create the router object
const User = require("../models/user.model"); // Import the User model
const jwt = require("jsonwebtoken"); // Import JWT for token generation
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const sendEmail = require("../utils/sendEmail"); // Import the sendEmail utility
const crypto = require("crypto"); // Import the crypto module for generating random tokens
const Token = require("../models/token.model"); // Import the Token model

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
    
    let user = await User.create({ name, email, password: hashedPassword }); // Create new user
    
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
    
    res.json({ status: "OK", message: "Verification Email sent successfully, Please Verify." });
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
      return res.status(400).json({ status: "ERROR", message: "User not found" });
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
    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      return res.status(404).json({ status: "ERROR", message: "User not found" });
    }

    // Compare password hashes using bcrypt
    const isMatch = await bcrypt.compare(password, user.password); // Replace with actual password validation logic

    if (!isMatch) {
      return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
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
      return res.json({ status: "ERROR", message: "Verification Email sent successfully, Please Verify." });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET
    ); // Generate JWT
    res.json({ status: "OK", token, user, message: "User logged in successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: "ERROR", error: "Login failed" }); // Generic error message
  }
});

module.exports = router; // Export the router for use in the main app
