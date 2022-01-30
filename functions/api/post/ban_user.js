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
const banID = '61e835c662c9ee839f5962c8';
module.exports = {
    name: "ban_user",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = object;
        const header = req.headers;
        const user = req.params.user;
        const idregex = new RegExp("[0-9]\d{17,18}");
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
        if (header.key != key)
            return res.send({
                "error": {
                    "message": "OWNER_ONLY",
                    "code": "none"
                }
            });
        if (isNaN(Number(user)))
            return res.send({
                "error": {
                    "message": "USER_ID_MUST_BE_NUMBER",
                    "code": "400"
                }
            });
        if (idregex.test(user))
            return res.send({
                "error": {
                    "message": "ID_IS_NOT_VALID",
                    "code": "400"
                }
            });
        const userGet = yield banModel.findById(banID);
        const search = userGet.bannedUsers.find((x) => x == user);
        if (search)
            return res.send({
                "error": {
                    "message": "BANNED_USER_ALREADY_EXISTS",
                    "code": "409"
                }
            });
        yield banModel.findByIdAndUpdate(banID, {
            $addToSet: { "bannedUsers": user }
        });
        return res.send({
            "success": {
                "message": "ADDED_USER_TO_BANS",
                "code": "201"
            }
        });
    })
};
