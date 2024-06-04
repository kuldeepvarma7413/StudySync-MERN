const mongoose = require("mongoose");
const userSchema = require("./user.model");
const answerSchema = require("./answer.model");

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    upvotes: {
        // array of user ids refering to user id
        type: [mongoose.Schema.Types.ObjectId],
        ref: userSchema,
        default: [],
    },
    views: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: userSchema,
        default: [],
    },
    answers: {
        // array of answers refering to answer id
        type: [mongoose.Schema.Types.ObjectId],
        ref: answerSchema,
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        Ref: userSchema,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const model = mongoose.model('Question', questionSchema);

module.exports = model;