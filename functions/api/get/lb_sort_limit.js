"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const result = require('../../errorWarningSuccess');
const randomInt = require('../../randomInt');
const channelModel = require('../../../shcemas/channelSchema');
const banModel = require('../../../shcemas/bannedUsers');
module.exports = {
    name: "lb_sort_limit",
    run: (app, object) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { req, res } = object;
        const sort = req.params.sort;
        const limit = req.params.limit;
        const array = {
            dsc: () => __awaiter(void 0, void 0, void 0, function* () {
                return yield channelModel.find().sort({ reputation: -1 }).limit(limit !== null && limit !== void 0 ? limit : 5);
            }),
            asc: () => __awaiter(void 0, void 0, void 0, function* () {
                return yield channelModel.find().sort({ reputation: 1 }).limit(limit !== null && limit !== void 0 ? limit : 5);
            })
        };
        return (_a = res.json(yield array[sort]())) !== null && _a !== void 0 ? _a : result.error(res, {
            message: "INVALID_TYPE",
            code: "400"
        });
    })
};
