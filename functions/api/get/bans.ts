export {};
import express from 'express';
const banModel = require('../../../shcemas/bannedUsers')
module.exports = {
    path: "bans",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
            const arr = await banModel.find()
            return res.json({ bannedUsers: arr[0].bannedUsers} || [])
    }
}