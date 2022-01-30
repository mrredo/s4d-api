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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { port, key, mongo } = require('./env.ts');
const app = (0, express_1.default)();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongo_1 = __importDefault(require("./functions/mongo"));
const mongoose = require('mongoose');
const LoadAPI = require('./functions/LoadAPI');
const dotenv_1 = __importDefault(require("dotenv"));
const bigyes = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    (0, mongo_1.default)(mongo, mongoose);
    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            "error": {
                "message": "Too many requests per IP, try again later!",
                "code": "429"
            }
        }
    });
    app.use('/api', apiLimiter);
    app.set('json spaces', 2);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.set('view engine', 'ejs');
    // Loads API
    LoadAPI(app, "api");
    // loads the website
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/qna', function (req, res) {
        res.render('qna.ejs');
    });
    app.get('/rules', function (req, res) {
        res.render('rules.ejs');
    });
    // listens to port
    app.listen(port, () => {
        console.log(`Server is listing on port ${port}`);
    });
    app.use(function (req, res, next) {
        res.status(404);
        // respond with html page
        if (req.accepts('html')) {
            res.render('404', { url: req.url });
            return;
        }
        // respond with json
        if (req.accepts('json')) {
            res.json({ error: 'Not found' });
            return;
        }
        // default to plain-text. send()
        res.type('txt').send('Not found');
    });
});
bigyes();
