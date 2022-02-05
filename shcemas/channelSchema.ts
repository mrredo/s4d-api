const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
        "channel_url": String,
        "_id": String,
        "channel_name": String,
        "channel_videos": [Object]
}, { versionKey: false})
const channelModel = module.exports = mongoose.model('channels', channelSchema);