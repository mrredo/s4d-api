const express = require('express');
const port = require('./env').port;
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const connect = require('./functions/mongo');
const mongo = require('./env').mongo;
const mongoose = require('mongoose');
const channelModel = require('./shcemas/channelSchema.js');
let bigyes = async () => {
let findid = "61e305438aa7159e05799163"
connect(mongo, mongoose);
console.log(await channelModel.find())
new channelModel({
  "channel_url": "dwadawd",
  "_id": "69s42s0",
  "channel_name": "test",
  "channel_videos": []
})//.save()

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

// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter)



app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET /api/users
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
    })
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
    let user = req.body.user;
    let header = req.headers
    if(header.key !== "e@#$%^&*(#$%^&*#$%^&ddde#$%^&*;Ds") return res.send("this is owner only post api!")
    if(!user.channel_name ||
       !user.channel_url || 
       !user.channel_videos ||
       !user.discord_id) return res.send("invalid parmeters! \n channel_name or channel_url or channel_videos or discord_id are required!")
    if(typeof user.channel_name !== 'string' || 
       typeof user.channel_url !== 'string'|
       typeof user.discord_id !== 'string' ||
       typeof user.channel_videos !== 'object') return res.send('invalid types of things so idk i dont want it :)')
    let search = await channelModel.findOne({
      _id: user._id
    })
    if(search) return res.send("user already exists on the api")
    new channelModel({
      "channel_url": user.channel_url,
      "_id": user.discord_id,
      "channel_name": user.channel_name,
      "channel_videos": []
    }).save()
    return res.send('Channel has been added successfully');
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
  let user = req.body.user;
  let header = req.headers
  if(header.key !== "e@#$%^&*(#$%^&*#$%^&ddde#$%^&*;Ds") return res.send("this is owner only post api!")
  if(!user.video_url ||
     !user.video_title || 
     !user.video_thumnail) return res.send("invalid parmeters! \n video_title or video_url or video_thumnail are required!")
  if(typeof user.video_url !== 'string' || 
     typeof user.video_title !== 'string'|
     typeof user.video_thumnail !== 'string') return res.send('invalid types of things so idk i dont want it :)')
  let search = await channelModel.findOne({
    _id: user._id
  })
  if(search) return res.send("user already exists on the api")
  new channelModel({
    "channel_url": user.channel_url,
    "_id": user.discord_id,
    "channel_name": user.channel_name,
    "channel_videos": []
  }).save()
  return res.send('Channel has been added successfully');
});

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index.ejs');
});
app.get('/qna', function(req, res) {
  res.render('qna.ejs');
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