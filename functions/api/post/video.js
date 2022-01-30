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
    name: "video",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        const { req, res } = object;
        const regexVID = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?");
        const video = req.body.video;
        const header = req.headers;
        if (mongoose.Types.ObjectId.isValid(video.discord_id)) {
            const check = yield banModel.findOne({
                _id: video.discord_id
            });
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
        if (!video.video_url ||
            !video.video_title ||
            !video.video_thumbnail)
            return res.send({
                "error": {
                    "message": "INVALID_PARAMETERS",
                    "code": "422"
                }
            });
        if (typeof video.video_url !== 'string' ||
            typeof video.video_title !== 'string' ||
            typeof video.video_thumbnail !== 'string')
            return res.send({
                "error": {
                    "message": "INVALID_TYPE_OF_OBJECTS",
                    "code": "400"
                }
            });
        if (regexVID.test(video.video_url) == false)
            return res.send({
                "error": {
                    "message": "INVALID_VIDEO_URL",
                    "code": "none"
                }
            });
        const search = yield channelModel.findOne({
            _id: video.discord_id
        });
        if (!search)
            return res.send({
                "error": {
                    "message": "CHANNEL_NOT_FOUND",
                    "code": "404"
                }
            });
        yield channelModel.findOneAndUpdate({
            _id: video.discord_id
        }, {
            $addToSet: { channel_videos: {
                    video_url: video.video_url,
                    video_title: video.video_title || "invalid name",
                    video_thumbnail: video.video_thumbnail
                } }
        });
        return res.send({
            "success": {
                "message": "ADDED_VIDEO",
                "code": "201"
            }
        });
    })
};
