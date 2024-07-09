const express = require("express");
const router = express.Router();
const Course = require("../models/course.model");
const requireAuth = require("../middleware/auth");

// courses
router.get("/", requireAuth, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({
      status: "OK",
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to fetch courses" });
  }
});

// add course
router.post("/add-course", requireAuth, async (req, res) => {
  try {
    const course = new Course({
      courseCode: req.body.courseCode,
      courseTitle: req.body.courseTitle,
      createdAt: Date.now(),
    });

    const savedCourse = await course.save();
    res.json({
      status: "OK",
      message: "Course added successfully",
      data: savedCourse,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to add course" });
  }
});

// delete course
router.delete("/delete-course/:id", requireAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    res.json({ status: "OK", message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to delete course" });
  }
});

// update course
router.put("/update-course/:id", requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.courseCode = req.body.courseCode;
    course.courseTitle = req.body.courseTitle;
    course.updatedAt = Date.now();

    const updatedCourse = await course.save();
    res.json({
      status: "OK",
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    console.error(err);
    res.json({ status: "ERROR", error: "Failed to update course" });
  }
});

module.exports = router;
