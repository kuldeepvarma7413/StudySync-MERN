const express = require("express");
const router = express.Router();
const Report = require("../models/report.model");
const User = require("../models/user.model");

router.post("/add", async (req, res) => {
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

// get all reports if admin access
router.get("/all", async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (user.role === "admin") {
        const reports = await Report.find().lean(); // Use lean for performance optimization
  
        // Fetch user data separately for each report
        const populatedReports = await Promise.all(
          reports.map(async (report) => {
            const populatedUser = await User.findById(report.user, 'username photo');
            report.user = populatedUser; // Assign populated user data to report
            return report;
          })
        );
  
        res.json({ status: "OK", reports: populatedReports });
      } else {
        res.json({ status: "ERROR", error: "Access denied" });
      }
    } catch (err) {
      console.error(err);
      res.json({ status: "ERROR", error: "Failed to fetch reports" });
    }
  });

module.exports = router;
