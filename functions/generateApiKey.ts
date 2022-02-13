import { randomBytes } from "crypto";
const authModel = require('../shcemas/login_schema')
async function genApiKey() {
    const key = await randomBytes(20).toString('hex')
    const data = await authModel.findOne({
        api_key: key
    })
    if(data) {
        await genApiKey()
    } else {
        return key
    }
}

module.exports = genApiKey