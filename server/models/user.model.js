const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    accountType: {type: String, default: 'custom'},
    role: {type: String, default: 'user'},
    password: {type: String},
    isDeleted : {type: Boolean, default: false},
    verified : {type: Boolean, default: false},
    questions: {type: [mongoose.Schema.Types.ObjectId], ref: 'Question', default: []},
    answers: {type: [mongoose.Schema.Types.ObjectId], ref: 'Answer', default: []},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()},
    photo: {type: String}
}, {collection: 'users'});

const model = mongoose.model('user', User);

module.exports = model;