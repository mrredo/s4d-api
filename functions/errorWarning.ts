let result: object = {
    warn: (result: any, object: { message: string, code: string}) => {
        return result.send({
            "warning": {
                message: object.message,
                code: object.code
            }
        });
    },
    error: (result: any, object: { message: string, code: string}) => {
        return result.send({
            "error": {
                message: object.message,
                code: object.code
            }
        });
    },
    success: (result: any, object: { message: string, code: string}) => {
        return result.send({
            "success": {
                message: object.message,
                code: object.code
            }
        });
    }
    
}
module.exports = result