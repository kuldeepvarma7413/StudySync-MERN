const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode:{
        type: String,
        required: true
    },
    courseTitle:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;