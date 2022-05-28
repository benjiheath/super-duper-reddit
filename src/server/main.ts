import { DatabaseService } from './database/database.service';
import { authMiddleware } from './middleware/auth.middleware';
import { SessionService } from './modules/session/session.service';
import { sessionRouter } from './modules/session/session.controller';
import { errorHandler } from './middleware/error.middleware';
import { postsRouter } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { UserService } from './modules/user/user.service';
import { userRouter } from './modules/user/user.controller';
import { getConfig } from './config';
import { Router } from 'express';
import { Config } from './config';
import { Pool } from 'pg';
import express from 'express';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

interface MainDeps {
  config: Config;
  sessionRouter: Router;
  userRouter: Router;
  postsRouter: Router;
}

export const config = getConfig();
export const pool = new Pool(config.poolConfig);
export const databaseService = new DatabaseService(pool);
export const userService = new UserService(databaseService);
export const postService = new PostService(databaseService);
export const sessionService = new SessionService(databaseService, userService);

const main = (deps: MainDeps) => {
  const { config, sessionRouter, userRouter, postsRouter } = deps;

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

main({ config, sessionRouter, userRouter, postsRouter });
