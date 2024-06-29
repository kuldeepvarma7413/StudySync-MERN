// PDFFile Model Schema
const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: String,
        required: true
    }
});

const PDFFile = mongoose.model('PDFFile', pdfFileSchema);

module.exports = PDFFile;
