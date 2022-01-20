const mongoose = require('mongoose');
const bannedUsers = new mongoose.Schema({
        "bannedUsers": []
}, { versionKey: false})
const banModel = module.exports = mongoose.model('bannedUsers', bannedUsers);