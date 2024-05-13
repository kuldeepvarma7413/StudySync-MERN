const express = require('express');
const router = express.Router(); // Create the router object
const User = require('../models/user.model'); // Import the User model
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Registration route
router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body; // Destructure request body

  try {
    const existingUser = await User.findOne({ email }); // Check for existing user

    if (existingUser) {
      return res.json({ status: 'ERROR', error: 'Duplicate email found' });
    }

    // Hash password using bcrypt before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust cost factor as needed

    const user = await User.create({ name, email, password: hashedPassword }); // Create new user
    res.json({ status: 'OK', message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: 'ERROR', error: 'Registration failed' }); // Generic error message
  }
});

// Login route
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body; // Destructure request body

  try {
    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      return res.json({ status: 'ERROR', message: 'User not found' });
    }

    // Compare password hashes using bcrypt
    const isMatch = await bcrypt.compare(password, user.password); // Replace with actual password validation logic

    if (!isMatch) {
      return res.json({ status: 'ERROR', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET); // Generate JWT
    res.json({ status: 'OK', token, message: 'User logged in successfully' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.json({ status: 'ERROR', error: 'Login failed' }); // Generic error message
  }
});

module.exports = router; // Export the router for use in the main app
