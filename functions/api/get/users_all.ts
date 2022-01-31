export {};
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
module.exports = {
    name: "users_all",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
        return res.json(await channelModel.find())
    }
}