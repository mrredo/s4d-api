export {};
const result = require('../../errorWarningSuccess.ts');
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
module.exports = {
    name: "lb_sort",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
            const { req, res } = object
            const sort = req.params.sort
            const array: any = {
              dsc: async () => {
                return await channelModel.find().sort({reputation: -1})
              },
              asc: async () => {
                return await channelModel.find().sort({reputation: 1})
              }
            }
            return res.json(await array[sort]()) ?? result.error(res, {
              message: "INVALID_TYPE",
              code: "400"
            });
    }
}