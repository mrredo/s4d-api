export {};
const result = require('../../errorWarningSuccess');
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
module.exports = {
    name: "lb_sort_limit",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
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