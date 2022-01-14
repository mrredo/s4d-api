const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
    "user": [{
        "channel_url": String,
        "discord_id": String,
        "channel_name": String,
        "channel_videos": Array
    }]

})
const channelModel = module.exports = mongoose.model('channels', channelSchema);