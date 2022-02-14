export {};
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
import authModel from '../../../shcemas/login_schema';
module.exports = {
    path: "users_all",
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
        return res.json(await channelModel.find())
    }
}