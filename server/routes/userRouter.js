const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

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

module.exports = router;
