import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router } from './routes/user.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/users', router);

export { app };