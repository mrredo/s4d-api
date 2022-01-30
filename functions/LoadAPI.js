"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = (folder, file) => require(`./api/${folder !== null && folder !== void 0 ? folder : "get"}/${file !== null && file !== void 0 ? file : "null"}`);
module.exports = (app, folder) => __awaiter(void 0, void 0, void 0, function* () {
    // GET requests
    app.get('/api/lb/:sort/:limit/', (req, res) => api("get", "lb_sort_limit").run(app, { req, res }));
    app.get('/api/lb/:sort/', (req, res) => api("get", "lb_sort").run(app, { req, res }));
    app.get('/api/users/all', (req, res) => api("get", "users_all").run(app, { req, res }));
    app.get('/api/users/:type/:user/', (req, res) => api("get", "users_type_user").run(app, { req, res }));
    app.get('/api/bans', (req, res) => api("get", "bans").run(app, { req, res }));
    // POST requests
    app.post('/api/post/ban/:user/', (req, res) => api("post", "ban_user").run(app, { req, res }));
    app.post('/api/post/channel/', (req, res) => api("post", "channel").run(app, { req, res }));
    app.post('/api/post/video/', (req, res) => api("post", "video").run(app, { req, res }));
    // DELETE requests
    app.delete('/api/delete/ban/:user/', (req, res) => api("delete", "ban_user").run(app, { req, res }));
    app.delete('/api/delete/channel/:id/', (req, res) => api("delete", "channel").run(app, { req, res }));
    app.delete('/api/delete/video/:id/:video/', (req, res) => api("delete", "video").run(app, { req, res }));
});
