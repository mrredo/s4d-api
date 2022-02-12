const mongoose = require('mongoose');
const req = (type: any) => {
    return {
    type: type,
    required: true
    }
}
const channelSchema = new mongoose.Schema({
    _id: req(String), // user id
    access_token: req(String),
    token_type: req(String),
    expires_in: req(Number),
    refresh_token: req(String),
    scope: req(String),
    user: {
        id: req(String),
        username: req(String),
        discrimination: req(String),
        avatar: req(String),
        language: req(String)
    }
}, { versionKey: false})
export = mongoose.model('api_users', channelSchema);