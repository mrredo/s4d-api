import express from 'express'
const authModel = require('../shcemas/login_schema')
const Router = express.Router()
const { regenApiKey } = require("../functions/generateApiKey")
Router.get('/regen', async (req: express.Request, res: express.Response) => {
    const session = req.session as any
    if(!session.user) return res.redirect(session.current_url ?? "/")
    await regenApiKey(session.user.id, session)
    res.redirect(session.current_url ?? "/")
})
module.exports.Router = Router