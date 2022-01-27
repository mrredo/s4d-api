export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "lb_sort_limit",
    run: async (app: express.Application) => {
        app.get('/api/lb/:sort/:limit/', async function(req, res){
            let sort = req.params.sort
            let limit = req.params.limit
            let array: any = {
              dsc: async () => {
                return await channelModel.find().sort({reputation: -1}).limit(limit ?? 5)
              },
              asc: async () => {
                return await channelModel.find().sort({reputation: 1}).limit(limit ?? 5)
              }
            }
            return res.json(await array[sort]()) ?? result.error(res, {
              message: "INVALID_TYPE",
              code: "400"
            });
            
          });
    }
}