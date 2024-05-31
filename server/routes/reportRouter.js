const express = require("express");
const router = express.Router();
const Report = require("../models/report.model");
const User = require("../models/user.model");

router.post("/", async (req, res) => {
    try {
        const { subject, bugOrFeature, description } = req.body;
        const user = await User.findOne({ email: req.user.email });
        const report = new Report({ subject, bugOrFeature, description, user: user._id });
        await report.save();
        res.json({ status: "OK", message: "Report submitted successfully" });   
    } catch (err) {
        console.error(err);
        res.json({ status: "ERROR", error: "Failed to Report" });
    }
});

module.exports = router;
