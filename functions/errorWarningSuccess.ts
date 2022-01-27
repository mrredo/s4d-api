import express from 'express'

let result: object = {
    warn: (result: express.Response, object: { message: string, code: string}) => {
        return result.send({
            "warning": {
                message: object.message,
                code: object.code
            }
        });
    },
    error: (result: express.Response, object: { message: string, code: string}) => {
        return result.send({
            "error": {
                message: object.message,
                code: object.code
            }
        });
    },
    success: (result: express.Response, object: { message: string, code: string}) => {
        return result.send({
            "success": {
                message: object.message,
                code: object.code
            }
        });
    }
    
}
module.exports = result