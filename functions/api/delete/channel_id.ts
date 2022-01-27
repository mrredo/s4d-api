export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
const { key } = require('../../../env.ts')
module.exports = {
    name: "channel_id",
    run: async (app: express.Application) => {
        app.delete('/api/delete/users/channel/:id/', async (req: express.Request, res: express.Response) => {
            let header: any = req.headers.key
            let user: string = req.params.id;
            let idregex = new RegExp("[0-9]\d{17,18}")
            if(header != key) return res.send({
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
            let search = await channelModel.findOne({
              _id: user
            });
            if(!search) return res.send({
              "error": {
                "message": "CHANNEL_NOT_FOUND",
                "code": "404"
              }
            });
            await channelModel.findOneAndDelete({
              _id: user
            });
            return res.send({
              "success": {
                "message": "REMOVED_USER_FROM_API",
                "code": "201"
              }
            });
          });
          
    }
}