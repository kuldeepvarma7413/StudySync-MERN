const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscribe.model");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.json({ status: "OK", message: "Thank you for subscribing" });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to subscribe" });
  }
});

module.exports = router;
