export {};
import express from 'express';
const mongoose = require('mongoose');
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "users_type_user",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
      const type = req.params.type
            const user = req.params.user
            if(mongoose.Types.ObjectId.isValid(user)) {
            const check = await banModel.findOne({
              _id: user
            })
            if(check) return res.json({
              "error": {
                "message": "BANNED_USER",
                "code": "403"
              }
            })
          }
            const array = await channelModel.find()
            const search: any = {
              channel_name: array.find((x: any) => x.channel_name === user),
              channel_url: array.find((x: any) => x.channel_url === user),
              discord_id: array.find((x: any) => x._id === user),
            }
            if(search[type]) {
              return res.json(search[type])
            } else {
              return res.json({
                "error": {
                  "message": "Couldnt find the user",
                  "code": "404"
                }
              });
            }
    }
}