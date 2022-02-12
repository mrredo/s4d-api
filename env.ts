require('dotenv').config()
export = {
    "port": 8080,
    "mongo": process.env.mongo ?? "",
    "key": process.env.key ?? "",
    "client_id": process.env.client_id ?? "",
    "client_secret": process.env.client_secret ?? ""
}
