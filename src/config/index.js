import express from 'express';
import helmet from 'helmet';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';

import configureSwagger from "./swagger.config.js";

import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function (app){
    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());
    
    app.use('/public', express.static(path.join(__dirname, '../public')));
    
    morganBody(app);
    
    configureSwagger(app);
}