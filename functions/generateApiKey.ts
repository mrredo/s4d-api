import { randomBytes, createHash } from "crypto";
const authModel = require('../shcemas/login_schema')
async function genApiKey() {
    const key = randomBytes(16).toString('hex')
    const hashedKey = hashApiKey(key)
    const data = await authModel.findOne({
        api_key: hashedKey
    })
    if(data) {
        await genApiKey()
    } else {
        return {
            hash: hashApiKey,
            key: key
        }
    }
}

function hashApiKey(key: any) {
    const hashApiKey = createHash('md5').update(key).digest('hex')
    return hashApiKey
}
module.exports = genApiKey