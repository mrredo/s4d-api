require('dotenv').config()
export = {
    "port": 8080,
    "mongo": process.env.mongo ?? "",
    "key": process.env.key ?? ""
}
