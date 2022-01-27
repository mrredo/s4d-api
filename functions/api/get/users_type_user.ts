export {};
import express from 'express';
const channelModel: any = require('../../../shcemas/channelSchema')
const banModel: any = require('../../../shcemas/bannedUsers')
module.exports = {
    name: "users_type_user",
    run: async (app: express.Application) => {
        app.get('/api/users/:type/:user', async function(req: express.Request, res: express.Response){
            let type = req.params.type
            let user = req.params.user
            if(mongoose.Types.ObjectId.isValid(user)) {
            let check = await banModel.findOne({
              _id: user
            })
            if(check) return res.json({
              "error": {
                "message": "BANNED_USER",
                "code": "403"
              }
            })
          }
            let array = await channelModel.find()
            let search: any = {
              channel_name: array.find((x: any) => x.channel_name === user),
              channel_url: array.find((x: any) => x.channel_url === user),
              discord_id: array.find((x: any) => x._id === user),
            }
            if(search[type]) {
              return res.json(search[type])
            } else {
              return res.json({
                "error": {
                  "message": "Couldnt find the user",
                  "code": "404"
                }
              });
            }
          });
    }
}