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
const banModel = require('../../../shcemas/banModel');
const { key } = require('../../../env.ts');
module.exports = {
    name: "video_id_video",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = object;
        const header = req.headers;
        const user = req.params.id;
        const video = req.params.video;
        const idregex = new RegExp("[0-9]\d{17,18}");
        const videoID = new RegExp("[0-9]|[0-9]\d{1,2}");
        if (header.key != key)
            return result.error(res, {
                "message": "OWNER_ONLY",
                "code": "none"
            });
        if (isNaN(Number(user)))
            return result.error(res, {
                "message": "USER_ID_MUST_BE_NUMBER",
                "code": "400"
            });
        if (idregex.test(user) == false)
            return result.error(res, {
                "message": "ID_IS_NOT_VALID",
                "code": "409"
            });
        if (videoID.test(video) == false)
            return result.error(res, {
                "message": "VIDEO_NUMBER_IS_NOT_VALID",
                "code": "409"
            });
        const search = yield channelModel.findOne({
            _id: user
        });
        if (!search)
            return result.error(res, {
                "message": "CHANNEL_NOT_FOUND",
                "code": "404"
            });
        if (!search.channel_videos[video])
            return result.error(res, {
                "message": "INVALID_VIDEO_NUMBER",
                "code": "404"
            });
        yield channelModel.findOneAndRemove({
            _id: user
        });
        return result.success(res, {
            "message": "REMOVED_A_USER_VIDEO_FROM_API",
            "code": "201"
        });
    })
};
