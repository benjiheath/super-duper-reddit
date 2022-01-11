require('dotenv').config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { __prod__ } from './constants';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { postsRouter, sessionRouter, userRouter } from './routes';
import { config } from './config';
import { authChecker } from './handlers/middleware/authChecker';

const app = express();
const PostgreSqlStore = require('connect-pg-simple')(session);

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(
  session({
    store: new PostgreSqlStore({
      conString: config.pg.conString,
    }),
    secret: config.esCookieSecret,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, path: '/', secure: __prod__, sameSite: 'lax' }, // 1 day
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());

app.use(authChecker);

// Routes
app.use('/session', sessionRouter);
app.use('/user', userRouter);
app.use('/posts', postsRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
