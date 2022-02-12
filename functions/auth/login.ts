export {};
import express from 'express';
const config = require('../../env')
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
interface Code {
	code: string
}
module.exports = {
    path: "auth/login",
    run: async (app: express.Application, object: { req: express.Request, res: express.Response}) => {
        const { req, res } = object
        const { code } = req.query as unknown as Code;
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
				console.log(oauthData)
				const userResult = await fetch('https://discord.com/api/users/@me', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				const userData = await userResult.json()
				console.log(userData);
				return res.send(userData)
			} catch {

			}
			} else {
				console.log("wdwdwd")
				return res.redirect("https://discord.com/api/oauth2/authorize?client_id=930543540432437298&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin&response_type=code&scope=identify")
			}
            
    }
}