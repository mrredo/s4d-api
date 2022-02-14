export {};
import express from 'express';
const banModel = require('../../../shcemas/bannedUsers')
import authModel from '../../../shcemas/login_schema';
const { key } = require('../../../env')
module.exports = {
    path: "bans",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
        const header = req.headers;

        const api_key: any = await authModel.findOne({
            api_key: header.api_key
          })
        if(!api_key) return res.status(401).send({
           "error": {
            "message": "NOT_UNAUTHORIZED",
            "code": "401"
          }
        });
            const arr = await banModel.find()
            return res.json({ bannedUsers: arr[0].bannedUsers} || [])
    }
}