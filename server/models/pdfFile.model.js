// PDFFile Model Schema
const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
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
    }
});

const PDFFile = mongoose.model('PDFFile', pdfFileSchema);

module.exports = PDFFile;
