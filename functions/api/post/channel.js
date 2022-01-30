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
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
const channelModel = require('../../../shcemas/channelSchema');
const banModel = require('../../../shcemas/bannedUsers');
const { key } = require('../../../env.ts');
module.exports = {
    name: "channel",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { req, res } = object;
        const regexCHN = new RegExp("(https?:\/\/)?(www\.)?youtu((\.be)|(be\..{2,5}))\/((user)|(channel))\/");
        const user = req.body.user;
        const header = req.headers;
        if (mongoose.Types.ObjectId.isValid(user.discord_id)) {
            const check = (_a = yield banModel.findOne({
                _id: user.discord_id
            })) !== null && _a !== void 0 ? _a : "e";
            if (check)
                return res.json({
                    "error": {
                        "message": "BANNED_USER",
                        "code": "403"
                    }
                });
        }
        if (header.key !== key)
            return res.send({
                "error": {
                    "message": "OWNER_ONLY",
                    "code": "none"
                }
            });
        if (!user.channel_name ||
            !user.channel_url ||
            !user.channel_videos ||
            !user.discord_id)
            return res.send({
                "error": {
                    "message": "INVALID_PARAMETERS",
                    "code": "422"
                }
            });
        if (typeof user.channel_name !== 'string' ||
            typeof user.channel_url !== 'string' ||
            typeof user.discord_id !== 'string' ||
            typeof user.channel_videos !== 'object')
            return res.send({
                "error": {
                    "message": "INVALID_TYPE_OF_OBJECTS",
                    "code": "400"
                }
            });
        if (regexCHN.test(user.channel_url) == false)
            return res.send({
                "error": {
                    "message": "INVALID_CHANNEL_URL",
                    "code": "none"
                }
            });
        const search = yield channelModel.findOne({
            _id: user.discord_id
        });
        if (search)
            return res.send({
                "error": {
                    "message": "CHANNEL_ALREADY_EXISTS",
                    "code": "409"
                }
            });
        new channelModel({
            "channel_url": user.channel_url,
            "_id": user.discord_id,
            "channel_name": user.channel_name,
            "reputation": randomInt(0, 1),
            "channel_videos": []
        }).save();
        return res.send({
            "success": {
                "message": "CREATED_CHANNEL",
                "code": "201"
            }
        });
    })
};
