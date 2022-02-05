const api = (folder: string, file: string) => require(`./api/${folder || "get"}/${file || "null"}`);

import express from 'express'
module.exports = async (app: express.Application, folder: string) => {
    // GET requests
    app.get('/api/lb/:sort/:limit/', (req, res) => api("get", "lb_sort_limit").run(app, { req, res }))
    app.get('/api/lb/:sort/', (req, res) => api("get", "lb_sort").run(app, { req, res }))
    app.get('/api/users/all', (req, res) => api("get", "users_all").run(app, { req, res }))
    app.get('/api/users/:type/:user/', (req, res) => api("get", "users_type_user").run(app, { req, res }))
    app.get('/api/bans', (req, res) => api("get", "bans").run(app, { req, res }))

    // POST requests
    app.post('/api/post/ban/:user/', (req, res) => api("post", "ban_user").run(app, { req, res }))
    app.post('/api/post/channel/', (req, res) => api("post", "channel").run(app, { req, res }))
    app.post('/api/post/video/', (req, res) => api("post", "video").run(app, { req, res }))

    // DELETE requests
    app.delete('/api/delete/ban/:user/', (req, res) => api("delete", "ban_user").run(app, { req, res }))
    app.delete('/api/delete/channel/:id/', (req, res) => api("delete", "channel").run(app, { req, res }))
    app.delete('/api/delete/video/:id/:video/', (req, res) => api("delete", "video").run(app, { req, res }))
}