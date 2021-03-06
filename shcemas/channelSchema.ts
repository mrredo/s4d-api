const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
        "channel_url": String,
        "_id": String,
        "channel_name": String,
        "reputation": {type: Number, default: 0},
        "channel_videos": [Object]
}, { versionKey: false})
export = mongoose.model('channels', channelSchema);