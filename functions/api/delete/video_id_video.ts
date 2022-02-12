export {};
const result = require('../../errorWarningSuccess');
import express from 'express';
import channelModel from '../../../shcemas/channelSchema'
const { key } = require('../../../env')
module.exports = {
    path: "video_id_video",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
            const header: any = req.headers;
            const user: string = req.params.id;
            const video: string = req.params.video;
            const idregex = new RegExp("[0-9]\d{17,18}")
            const videoID = new RegExp("[0-9]|[0-9]\d{1,2}")
            if(header.key != key) return result.error(res,{
                "message": "OWNER_ONLY",
                "code": "none"
            });
            if(isNaN(Number(user))) return result.error(res,{
                "message": "USER_ID_MUST_BE_NUMBER",
                "code": "400"
            });
            if(idregex.test(user) == false) return result.error(res,{
                "message": "ID_IS_NOT_VALID",
                "code": "409"
            })
            if(videoID.test(video) == false) return result.error(res,{
              "message": "VIDEO_NUMBER_IS_NOT_VALID",
              "code": "409"
            });
            const search = await channelModel.findOne({
              _id: user
            });
            if(!search) return result.error(res,{
                "message": "CHANNEL_NOT_FOUND",
                "code": "404"
            });
            if(!search.channel_videos[video]) return result.error(res,{
                "message": "INVALID_VIDEO_NUMBER",
                "code": "404"
            });
            await channelModel.findOneAndRemove({
              _id: user
            });
            return result.success(res,{
                "message": "REMOVED_A_USER_VIDEO_FROM_API",
                "code": "201"
            });
    }
}