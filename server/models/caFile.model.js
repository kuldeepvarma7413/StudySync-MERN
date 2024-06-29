// CAFile Model Schema
const mongoose = require('mongoose');

const caFileSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    caNumber: {
        type: Number,
        required: true
    },
    caDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
});

const CAFile = mongoose.model('CAFile', caFileSchema);

module.exports = CAFile;
