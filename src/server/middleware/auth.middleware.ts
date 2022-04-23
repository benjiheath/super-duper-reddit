import { RequestHandler } from 'express';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  if (!req.originalUrl.includes('/assets') && req.originalUrl !== '/') {
    req.session.userID
      ? next()
      : res.status(401).send({
          authorized: false,
          message: 'User unauthorized',
        });
    return;
  }
  next();
};
