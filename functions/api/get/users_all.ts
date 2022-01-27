export {};
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "users_all",
    run: async (app: express.Application) => {
        app.get('/api/users/all', async function(req: express.Request, res: express.Response){
            return res.json(await channelModel.find())
            })
    }
}