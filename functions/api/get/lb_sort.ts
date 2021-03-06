export {};
const result = require('../../errorWarningSuccess.ts');
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
import authModel from '../../../shcemas/login_schema';
module.exports = {
  path: "lb_sort",
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
            const array: any = {
              dsc: async () => {
                return await channelModel.find().sort({reputation: -1})
              },
              asc: async () => {
                return await channelModel.find().sort({reputation: 1})
              }
            }
            return res.json(await array[sort]()) || result.error(res, {
              message: "INVALID_TYPE",
              code: "400"
            });
    }
}