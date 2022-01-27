export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "bans",
    run: async (app: express.Application) => {
        app.get('/api/bans/', async function(req: express.Request, res: express.Response) {
            let arr = await banModel.find()
            return res.json({ bannedUsers: arr[0].bannedUsers} || [])
          });
    }
}