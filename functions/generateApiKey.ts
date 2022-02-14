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

async function regenApiKey(id: string, session: any) {
    const key = await randomBytes(20).toString('hex')
    const data = await authModel.findOne({
        _id: id,
        api_key: key
    })
    if(data) {
        await regenApiKey(id, session);
    } else {
        await authModel.findOneAndUpdate({
            _id: id
        }, {
            api_key: key
        })
        session.user.api_key = key
    }
}

module.exports = {
    genApiKey: genApiKey,
    regenApiKey: regenApiKey
}