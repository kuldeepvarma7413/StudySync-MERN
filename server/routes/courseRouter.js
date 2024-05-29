const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');


// courses
router.get('/', async (req, res) => {
    try {
        console.log('Fetching courses...');
        const courses = await Course.find();
        res.json({ status: 'OK', message: 'Courses fetched successfully', data: courses });
    } catch (err) {
        console.error(err);
        res.json({ status: 'ERROR', error: 'Failed to fetch courses' });
    }
});

// add course
router.post('/add-course', async (req, res) => {
    try {
        const course = new Course({
            courseCode: req.body.courseCode,
            courseTitle: req.body.courseTitle,
            createdAt: Date.now()
        });

        const savedCourse = await course.save();
        res.json({ status: 'OK', message: 'Course added successfully', data: savedCourse });

    } catch (err) {
        console.error(err);
        res.json({ status: 'ERROR', error: 'Failed to add course' });
    }
});
    

module.exports = router;