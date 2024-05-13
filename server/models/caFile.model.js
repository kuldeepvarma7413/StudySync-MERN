// CAFile Model Schema
const mongoose = require('mongoose');

const caFileSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        maxlength: 20
    },
    fileUrl: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacherName: {
        type: String,
        required: true,
        maxlength: 100
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
    }
});

const CAFile = mongoose.model('CAFile', caFileSchema);

module.exports = CAFile;
