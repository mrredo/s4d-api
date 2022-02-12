import express from 'express';
const { port, mongo } = require('./env.ts')
const app: express.Application = express();
import session from 'express-session'
import router from './router'
const randomString = require('./functions/randomString')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
import connect from './functions/mongo'
const mongoose = require('mongoose');
const LoadAPI = require('./functions/LoadAPI');
const authModel = require('./shcemas/login_schema')
import dotenv from 'dotenv'
const bigyes = async () => {
  dotenv.config();
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
// repl 24/7
app.listen(3000, () => {
  console.log("API revived LOL")
})
//api path and rate limiter
app.use('/api', apiLimiter)
// adds json spacing
app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express session
app.use(
  session({
      secret: randomString(),
      resave: false,
      saveUninitialized: false,
  })
);
// uses ejs as render engine
app.set('view engine', 'ejs');

// Loads API
LoadAPI(app, "api")
// loads the website
app.get('/', async (req: express.Request, res: express.Response) => {

  res.render('index.ejs', { user: await authModel.findOne({
    
  }) });
});
app.get('/docs', function(req: express.Request, res: express.Response) {
  res.render('MainDocsPage.ejs');
});
app.get('/docs/:type', async function(req: express.Request, res: express.Response) {
  let type = req.params.type
  if(type == "get") return res.render("docs/get/get.ejs")
    else return res.redirect("/docs/get")
})
app.get('/qna', function(req: express.Request, res: express.Response) {
  res.render('qna.ejs');
});
app.get('/rules', function(req: express.Request, res: express.Response) {
  res.render('rules.ejs');
});
//routers
router(app);
// listens to port
app.listen(port, () => {
  console.log(`Server is listing on port ${port}`);
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