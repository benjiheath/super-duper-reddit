require('dotenv').config();
import { DatabaseService } from './database/database.service';
import { sessionRouter } from './modules/session/session.routes';
import { authMiddleware } from './middleware/auth.middleware';
import { SessionService } from './modules/session/session.service';
import { errorHandler } from './middleware/error.middleware';
import { postsRouter } from './modules/post/post.routes';
import { PostService } from './modules/post/post.service';
import { UserService } from './modules/user/user.service';
import { userRouter } from './modules/user/user.routes';
import { __prod__ } from './constants';
import { Config } from './config';
import { Pool } from 'pg';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import session from 'express-session';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

export const config = new Config(process.env);
export const pool = new Pool(config.pg.poolConfig);
export const databaseService = new DatabaseService(pool);
export const userService = new UserService(databaseService);
export const postService = new PostService(databaseService);
export const sessionService = new SessionService(databaseService, userService);

const main = (config: Config) => {
  const app = express();

  app.use(cors(config.corsOptions));
  app.enable('trust proxy');
  app.use(session(config.sessionOptions));
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded());

  app.use('/api/session', sessionRouter);
  app.use('/api/user', userRouter);
  app.use('/api/posts', authMiddleware, postsRouter);

  app.use(errorHandler);

  app.use(history());

  if (config.isProd) {
    app.use(express.static(path.join(__dirname, '../client')));
  }

  app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`);
  });
};

main(config);
