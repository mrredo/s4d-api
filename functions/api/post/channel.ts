export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
const { key } = require('../../../env.ts')
module.exports = {
    name: "channel",
    run: async (app: express.Application) => {
        app.post('/api/post/channel', async function (req: express.Request, res: express.Response) {
            let regexCHN = new RegExp("(https?:\/\/)?(www\.)?youtu((\.be)|(be\..{2,5}))\/((user)|(channel))\/");
            let user = req.body.user;
            let header = req.headers
            if(mongoose.Types.ObjectId.isValid(user.discord_id)) {
            let check = await banModel.findOne({
              _id: user.discord_id
            }) ?? "e"
            if(check) return res.json({
              "error": {
                "message": "BANNED_USER",
                "code": "403"
              }
            })
          }
            if(header.key !== key) return res.send({
              "error": {
                "message": "OWNER_ONLY",
                "code": "none"
              }
            });
            if(!user.channel_name ||
               !user.channel_url || 
               !user.channel_videos ||
               !user.discord_id) return res.send({
                 "error": {
                   "message": "INVALID_PARAMETERS",
                   "code": "422"
                 }
               });
            if(typeof user.channel_name !== 'string' || 
               typeof user.channel_url !== 'string'||
               typeof user.discord_id !== 'string' ||
               typeof user.channel_videos !== 'object') return res.send({
                "error": {
                  "message": "INVALID_TYPE_OF_OBJECTS",
                  "code": "400"
                }
              });
              if(regexCHN.test(user.channel_url) == false) return res.send({
                "error": {
                  "message": "INVALID_CHANNEL_URL",
                  "code": "none"
                }
              })
            let search = await channelModel.findOne({
              _id: user.discord_id
            })
            if(search) return res.send({
              "error": {
                "message": "CHANNEL_ALREADY_EXISTS",
                "code": "409"
              }
            })
            new channelModel({
              "channel_url": user.channel_url,
              "_id": user.discord_id,
              "channel_name": user.channel_name,
              "reputation": randomInt(0, 1),
              "channel_videos": []
            }).save()
            return res.send({
              "success": {
                "message": "CREATED_CHANNEL",
                "code": "201"
              }
            });
        });
    }
}