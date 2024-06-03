const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    deleted : {type: Boolean, default: false},
    verified : {type: Boolean, default: false},
    role: {type: String, default: 'user'},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    photo: {type: String},
    answers: {type: [mongoose.Schema.Types.ObjectId], ref: 'Answer'},
    questions: {type: [mongoose.Schema.Types.ObjectId], ref: 'Question'},
}, {collection: 'users'});

// username: {type: String, required: true, unique: true},
const model = mongoose.model('UserData', User);

module.exports = model;