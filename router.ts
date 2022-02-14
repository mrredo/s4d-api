import express from 'express'
const Auth = require('./routes/auth')
const key = require('./routes/apiKey')
const route = async (app: express.Application) => {
    app.use('/auth/', Auth.Router)
    app.use('/key/', key.Router)
}
export = route