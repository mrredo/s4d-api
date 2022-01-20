const express = require('express');
const { port, key, mongo, token } = require('./env.js')
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const connect = require('./functions/mongo');
const mongoose = require('mongoose');
const channelModel = require('./shcemas/channelSchema.js');
const banModel = require('./shcemas/bannedUsers.js');
const axios = require('axios');
const banID = '61e835c662c9ee839f5962c8'
const bigyes = async () => {
connect(mongo, mongoose);
console.log(await channelModel.find())






const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
  message: {
    "error": {
      "message": "Too many requests per IP, try again later!",
      "code": "429"
    }
  }
})
//https://discord.com/api/v9/users/${id} url to get a user id
// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter)



app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/api/users/all', async function(req, res){
return res.json(await channelModel.find())
})
app.get('/api/users/:type/:user', async function(req, res){
  let type = req.params.type
  let user = req.params.user
  let array = await channelModel.find()
  let search = {
    channel_name: array.find(x => x.channel_name === user),
    channel_url: array.find(x => x.channel_url === user),
    discord_id: array.find(x => x._id === user),
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



/* POST /api/users
    {
        "user": {
           "id": 3,
            "name": "Test User",
            "age" : 20,
            "email": "test@test.com"
        }
    }
*/
app.post('/api/post/channel', async function (req, res) {
    let regexCHN = new RegExp("(https?:\/\/)?(www\.)?youtu((\.be)|(be\..{2,5}))\/((user)|(channel))\/");
    let user = req.body.user;
    let header = req.headers
    if(header.key !== key) return res.send({
      "error": {
        "message": "OWNER_ONLY",
        "code": "none"
      }
    });
    if(!user.channel_name ||
       !user.channel_url || 
       !user.channel_videos ||
       !user.discord_id) return res.send({
         "error": {
           "message": "INVALID_PARAMETERS",
           "code": "422"
         }
       });
    if(typeof user.channel_name !== 'string' || 
       typeof user.channel_url !== 'string'|
       typeof user.discord_id !== 'string' ||
       typeof user.channel_videos !== 'object') return res.send({
        "error": {
          "message": "INVALID_TYPE_OF_OBJECTS",
          "code": "400"
        }
      });
      if(regexCHN.test(user.channel_url) == false) return res.send({
        "error": {
          "message": "INVALID_CHANNEL_URL",
          "code": "none"
        }
      })
    let search = await channelModel.findOne({
      _id: user.discord_id
    })
    if(search) return res.send({
      "error": {
        "message": "CHANNEL_ALREADY_EXISTS",
        "code": "409"
      }
    })
    new channelModel({
      "channel_url": user.channel_url,
      "_id": user.discord_id,
      "channel_name": user.channel_name,
      "channel_videos": []
    }).save()
    return res.send({
      "success": {
        "message": "CREATED_CHANNEL",
        "code": "201"
      }
    });
});
/*
 user: {
   video_url: "",
   video_title: "",
   video_thumnail: "",
   _id: false
 }
*/
app.post('/api/post/video', async function (req, res) {
  let regexVID = new RegExp("^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?");
  let video = req.body.video;
  let header = req.headers;
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
  let search = await channelModel.findOne({
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
});
app.post('/api/post/ban/', async function (req, res) {
  let header = req.headers;

  if(isNaN(header.id.replace("-id", ""))) return res.send({
    "error": {
      "message": "USER_ID_MUST_BE_NUMBER",
      "code": "400"
    }
  });
  // if(header.id.length < 19 || header.id.length > 19) return res.send({
  //   "error": {
  //     "message": "ID_IS_NOT_VALID",
  //     "code": "400"
  //   }
  // });
  if(header.key != key) return res.send({
    "error": {
      "message": "OWNER_ONLY",
      "code": "none"
    }
  });
  await banModel.findByIdAndUpdate(banID, {
    $addToSet: { "bannedUsers": header.id}
  });
  return res.send({
    "success": {
      "message": "ADDED_USER_TO_BANS",
      "code": "201"
    }
  });
});
app.get('/api/bans/', async function(req, res) {
  let arr = await banModel.find()
  return res.json({ bannedUsers: arr[0].bannedUsers})
});
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index.ejs');
});
app.get('/qna', function(req, res) {
  res.render('qna.ejs');
});
app.get('/rules', function(req, res) {
  res.render('rules.ejs');
});


app.listen(port, function(req, res) {
  console.log(`Server is running at port ${port}`);
});
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
}
bigyes();