"use strict";
const mongooses = require('mongoose');
const bannedUsers = new mongooses.Schema({
    "bannedUsers": []
}, { versionKey: false });
const banModels = module.exports = mongooses.model('bannedUsers', bannedUsers);
