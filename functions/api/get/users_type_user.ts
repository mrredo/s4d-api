export {};
import express from 'express';
import mongoose from 'mongoose';
import channelModel from '../../../shcemas/channelSchema'
const banModel: any = require('../../../shcemas/bannedUsers')
import authModel from '../../../shcemas/login_schema';
module.exports = {
  path: "users_type_user",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
      const header = req.headers
      const api_key: any = await authModel.findOne({
        api_key: header.api_key
      })
      if(!api_key) return res.status(401).send({
        "error": {
          "message": "NOT_UNAUTHORIZED",
          "code": "401"
        }
      });
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