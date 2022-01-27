const api = (folder: string, file: string) => require(`./api/${folder ?? "get"}/${file ?? "null"}`);

import express from 'express'
module.exports = async (app: express.Application, folder: string) => {
    //get functions for api
    let get: any = {
        bans: () => api("get", "bans").run(app),
        lb_sort_limit: () => api("get", "lb_sort_limit").run(app),
        lb_sort: () => api("get", "lb_sort").run(app),
        users_all: () => api("get", "users_all").run(app),
        users_type_user: () => api("get", "users_type_user").run(app)
    }
    await get.users_all()
    //await get.bans()
}