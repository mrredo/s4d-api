export {};
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
import mongoose from 'mongoose'
const { key } = require('../../../env')
module.exports = {
    path: "video",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
      const { req, res } = object
            const regexVID = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?");
            const video = req.body.video;
            const header = req.headers;
            if(mongoose.Types.ObjectId.isValid(video.discord_id)) {
            const check = await banModel.findOne({
              _id: video.discord_id
            })
            if(check) return res.json({
              "error": {
                "message": "BANNED_USER",
                "code": "403"
              }
            })
            }
            if(header.key !== key) return res.send({
              "error": {
                "message": "OWNER_ONLY",
                "code": "none"
              }
            })
            if(!video.video_url ||
               !video.video_title ||
               !video.video_thumbnail) return res.send({
                "error": {
                  "message": "INVALID_PARAMETERS",
                  "code": "422"
                }
               })
            if(typeof video.video_url !== 'string' ||
               typeof video.video_title !== 'string'||
               typeof video.video_thumbnail !== 'string') return res.send({
                "error": {
                  "message": "INVALID_TYPE_OF_OBJECTS",
                  "code": "400"
                }
              })
            if(regexVID.test(video.video_url) == false) return res.send({
              "error": {
                "message": "INVALID_VIDEO_URL",
                "code": "none"
              }
              })
            const search = await channelModel.findOne({
              _id: video.discord_id
            });
            if(!search) return res.send({
              "error": {
                "message": "CHANNEL_NOT_FOUND",
                "code": "404"
              }
            });
            await channelModel.findOneAndUpdate({
              _id: video.discord_id
             }, {
              $addToSet: { channel_videos: {
                video_url: video.video_url,
                video_title: video.video_title || "invalid name",
                video_thumbnail: video.video_thumbnail
              }}
            });
            return res.send({
              "success": {
                "message": "ADDED_VIDEO",
                "code": "201"
              }
            });
    }
}