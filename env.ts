require('dotenv').config()
export = {
    "port": 8080,
    "mongo": process.env.mongo ?? "",
    "key": process.env.key ?? "",
    "client_id": process.env.client_id ?? "",
    "client_secret": process.env.client_secret ?? "",
    "repl_url": "https://s4d-api.mrredogaming.repl.co",
    "repl_redirect": "https://discord.com/api/oauth2/authorize?client_id=930543540432437298&redirect_uri=https%3A%2F%2Fs4d-api.mrredogaming.repl.co%2Fauth%2Flogin&response_type=code&scope=identify"
}
