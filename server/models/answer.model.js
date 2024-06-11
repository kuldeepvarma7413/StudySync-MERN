const mongoose = require("mongoose");
const userSchema = require("./user.model");

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    upvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: userSchema,
        default: [],
    },
    downvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: userSchema,
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

const model = mongoose.model('Answer', answerSchema);

module.exports = model;