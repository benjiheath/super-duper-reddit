import { RequestHandler } from 'express';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const authChecker: RequestHandler = async (req, res, next) => {
  try {
    // if (req.method === 'GET' && req.originalUrl !== '/session') {
    if (!req.originalUrl.includes('/user') && req.originalUrl !== '/session') {
      req.session.userID
        ? next()
        : res.status(401).send({
            authorized: false,
            message: 'User unauthorized',
          });
      return;
    }
    next();
  } catch (err) {
    console.error(err);
  }
};
