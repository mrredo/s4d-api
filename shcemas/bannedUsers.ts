const mongooses = require('mongoose');
const bannedUsers = new mongooses.Schema({
        "bannedUsers": []
}, { versionKey: false})
const banModel = module.exports = mongooses.model('bannedUsers', bannedUsers);