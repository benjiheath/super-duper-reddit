require('dotenv').config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { __prod__ } from './constants';
import session from 'express-session';
import { sessionRouter, postsRouter, userRouter } from './routes';
import cookieParser from 'cookie-parser';
import { authChecker } from './controllers';
import path from 'path';

const app = express();
export const PostgreSqlStore = require('connect-pg-simple')(session);

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
      conString: process.env.CON_STRING,
    }),
    secret: process.env.COOKIE_SECRET as string,
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
