export {};
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
const { key } = require('../../../env');
module.exports = {
    path: "channel_id",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
      const header: any = req.headers.key
      const user: string = req.params.id;
      const idregex = new RegExp("[0-9]\d{17,18}")
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
      const search = await channelModel.findOne({
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

    }
}