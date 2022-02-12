import express from 'express';
const { port, key, mongo, client_id, client_secret } = require('./env.ts')
const app: express.Application = express();
app.listen(3000, () => {
  console.log("API revived LOL")
})
import router from './router'
const Router = require('./router')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
import connect from './functions/mongo'
const mongoose = require('mongoose');
const LoadAPI = require('./functions/LoadAPI');
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
app.use('/api', apiLimiter)

app.set('json spaces', 2)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// Loads API
LoadAPI(app, "api")
// loads the website
app.get('/', function(req: express.Request, res: express.Response) {
  res.render('index.ejs');
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
interface Code {
	code: string
}
app.get('/login', async (req: express.Request, res: express.Response) => {
  const { code } = req.query as unknown as Code;
  if(code) {
    try {
      const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `http://localhost:${port}/auth/login`,
        scope: 'identify',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          },
      });
          
      const oauthData = await oauthResult.json();
      console.log(oauthData)
      const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
      const userData = await userResult.json()
      console.log(userData);
      return res.redirect('/')
    } catch {
      console.error;
    }
    } else return res.redirect("https://discord.com/api/oauth2/authorize?client_id=930543540432437298&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin&response_type=code&scope=identify")
})

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