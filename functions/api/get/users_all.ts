export {};
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "users_all",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
        return res.json(await channelModel.find())
    }
}