import express from 'express'
import mongoose from 'mongoose'
const authModel = require('../shcemas/login_schema')
const Router = express.Router()
const name = {
    login:'/login',
    logout: '/logout'
}
/*
data for login schema
 _id: req(String), // user id
    access_token: req(String),
    token_type: req(String),
    expires_in: req(Number),
    refresh_token: req(String),
    scope: req(String),
    user: {
        id: req(String),
        username: req(String),
        discrimination: req(String),
        avatar: req(String),
        language: req(String)
    }
 */
const Auth = Router
            .get(name.login, (req: express.Request, res: express.Response) => {
                return res.send("BOI")
            })
            .get(name.logout, (req: express.Request, res: express.Response) => {
                return res.send("LOGOUT")
            })
module.exports.Router = Router
module.exports.name = name


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