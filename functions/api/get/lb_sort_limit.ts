export {};
const result = require('../../errorWarningSuccess');
import express from 'express';
import authModel from '../../../shcemas/login_schema';
import channelModel from '../../../shcemas/channelSchema'
module.exports = {
  path: "/api/lb/:sort/:limit/",
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
      const sort = req.params.sort
      const limit = req.params.limit
      const array: any = {
        dsc: async () => {
          return await channelModel.find().sort({reputation: -1}).limit(limit || 5)
        },
        asc: async () => {
          return await channelModel.find().sort({reputation: 1}).limit(limit || 5)
        }
      }
      return res.json(await array[sort]()) || result.error(res, {
        message: "INVALID_TYPE",
        code: "400"
      });
    }
}