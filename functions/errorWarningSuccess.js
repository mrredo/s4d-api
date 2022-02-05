"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result = {
    warn: (result, object) => {
        return result.send({
            "warning": {
                message: object.message,
                code: object.code
            }
        });
    },
    error: (result, object) => {
        return result.send({
            "error": {
                message: object.message,
                code: object.code
            }
        });
    },
    success: (result, object) => {
        return result.send({
            "success": {
                message: object.message,
                code: object.code
            }
        });
    }
};
module.exports = result;
