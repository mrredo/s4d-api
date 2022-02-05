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
    name: "channel_id",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = object;
        const header = req.headers.key;
        const user = req.params.id;
        const idregex = new RegExp("[0-9]\d{17,18}");
        if (header != key)
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
        const search = yield channelModel.findOne({
            _id: user
        });
        if (!search)
            return res.send({
                "error": {
                    "message": "CHANNEL_NOT_FOUND",
                    "code": "404"
                }
            });
        yield channelModel.findOneAndDelete({
            _id: user
        });
        return res.send({
            "success": {
                "message": "REMOVED_USER_FROM_API",
                "code": "201"
            }
        });
    })
};
