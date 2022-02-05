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
const mongoose = require('mongoose');
const channelModel = require('../../../shcemas/channelSchema');
const banModel = require('../../../shcemas/bannedUsers');
module.exports = {
    name: "users_type_user",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = object;
        const type = req.params.type;
        const user = req.params.user;
        if (mongoose.Types.ObjectId.isValid(user)) {
            const check = yield banModel.findOne({
                _id: user
            });
            if (check)
                return res.json({
                    "error": {
                        "message": "BANNED_USER",
                        "code": "403"
                    }
                });
        }
        const array = yield channelModel.find();
        const search = {
            channel_name: array.find((x) => x.channel_name === user),
            channel_url: array.find((x) => x.channel_url === user),
            discord_id: array.find((x) => x._id === user),
        };
        if (search[type]) {
            return res.json(search[type]);
        }
        else {
            return res.json({
                "error": {
                    "message": "Couldnt find the user",
                    "code": "404"
                }
            });
        }
    })
};
