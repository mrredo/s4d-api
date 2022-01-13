const express = require('express');
const port = require('./env.json').port;
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit')
const connect = require('./functions/mongo')
const mongo = require('./env.json').mongo
const mongoose = require('mongoose');
connect(mongo, mongoose);


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

let users = [{
    "channel_url": "ee",
    "discord_id": "2",
    "channel_name": "test",
    "channel_videos": [{
        "video_url": "",
        "video_title": "",
        "video_thumbnail": ""
    }]
}];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET /api/users
app.get('/api/users/:type', function(req, res){
  let type = req.params.type
  switch(type) {
    case "all":
      return res.json(users)
  }
})
app.get('/api/users/:type/:user', function(req, res){
  let type = req.params.type
  let user = req.params.user
  let search = {
    channel_name: users.find(x => x.channel_name === user),
    channel_url: users.find(x => x.channel_url === user),
    discord_id: users.find(x => x.discord_id === user),
  }
  if(search[type]) {
    return res.json(search)
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
app.post('/api/users', function (req, res) {
    let user = req.body.user;
    users.push(user)
    let header = req.headers
    let query = req.query
    if(header.key !== "e@#$%^&*(#$%^&*#$%^&ddde#$%^&*;Ds") return res.send("this is owner only post api!")
    if(!user.channel_name || !user.channel_url || !user.channel_videos || !user.discord_id) return res.send("invalid parmeters! \n channel_name or channel_url or channel_videos or discord_id are required!")



    users.push(user)
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