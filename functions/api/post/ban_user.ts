export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
const { key } = require('../../../env')
import mongoose from 'mongoose'
const banID = '61e835c662c9ee839f5962c8'
module.exports = {
    name: "ban_user",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
            const header: any = req.headers;
            const user: string = req.params.user
            const idregex = new RegExp("[0-9]\d{17,18}")
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
            if(header.key != key) return res.send({
              "error": {
                "message": "OWNER_ONLY",
                "code": "none"
              }
            });
            if(isNaN(Number(user))) return res.send({
              "error": {
                "message": "USER_ID_MUST_BE_NUMBER",
                "code": "400"
              }
            });
            if(idregex.test(user)) return res.send({
              "error": {
                "message": "ID_IS_NOT_VALID",
                "code": "400"
              }
            });
            const userGet = await banModel.findById(banID)
            const search = userGet.bannedUsers.find((x: any) => x == user)
            if(search) return res.send({
              "error": {
                "message": "BANNED_USER_ALREADY_EXISTS",
                "code": "409"
              }
            })
            await banModel.findByIdAndUpdate(banID, {
              $addToSet: { "bannedUsers": user}
            });
            return res.send({
              "success": {
                "message": "ADDED_USER_TO_BANS",
                "code": "201"
              }
            });
    }
}