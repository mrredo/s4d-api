import express from 'express'
const authModel = require('../shcemas/login_schema')
const Router = express.Router()
const config = require('../env')
const fetch = require('node-fetch')
const genApiKey = require("../functions/generateApiKey")
/*
data for login schema
 _id: req(String), // user id
    access_token: req(String),
    token_type: req(String),
    expires_in: req(Number),
    refresh_token: req(String),
    user: {
        username: req(String),
        discrimination: req(String),
        avatar: req(String),
        language: req(String)
    }
 */
interface Code {
	code: string
}
Router
    .get('/login', async (req: express.Request, res: express.Response) => {
		const { code } = req.query as unknown as Code;
		const session = req.session as any
        if(code) {
			try {
				const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
					method: 'POST',
					body: new URLSearchParams({
					client_id: config.client_id,
					client_secret: config.client_secret,
					code: code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${config.port}/auth/login`,
					scope: 'identify',
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						},
				});
						
				const oauthData = await oauthResult.json();
				const userResult = await fetch('https://discord.com/api/users/@me', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				const userData = await userResult.json()
				const dataUserMongo = await authModel.findOne({
					_id: userData.id
				}) 
				const key = await genApiKey();
				if(!dataUserMongo) new authModel({
					_id: userData.id,
					access_token: oauthData.access_token,
					token_type: oauthData.token_type,
					expires_in: oauthData.expires_in + Date.now(),
					refresh_token: oauthData.refresh_token,
					api_key: key ?? "none"
				}).save();
				session.user = {}
				session.user = {
					id: userData.id,
					username: userData.username,
					discriminator: userData.discriminator,
					avatar: userData.avatar,
					locale: userData.locale,
					avatarURL: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`,
					api_key: key ?? "none"
				}
				
				
				return res.redirect(session.current_url)
			} catch(error) {
				console.log(error)
			}
			} else return res.redirect("https://discord.com/api/oauth2/authorize?client_id=930543540432437298&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin&response_type=code&scope=identify")
            })
    .get('/logout', async (req: express.Request, res: express.Response) => {
		const session = req.session as any
		session.destroy()
		return res.redirect(session.current_url)
    })
module.exports.Router = Router


/*
discord 2auth
const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code: code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}`,
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
			return response.render('index.ejs', { 
				user: userData, 
				avatar: {
					url: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`
				}
			});
*/