import express from 'express'
const Auth = require('./routes/auth')
const route = async (app: express.Application) => {
    app.use('/auth/', Auth.Router)
}
export = route