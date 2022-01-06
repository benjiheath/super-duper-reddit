//** Route that checks if user is auth otherwise */
import { RequestHandler } from 'express';

export const sendSessionStatus: RequestHandler = async (req, res, _) => {
  try {
    req.session.userId
      ? res.status(200).send({ auth: true, userId: req.session.userId })
      : res.status(200).send({ auth: false, userId: null });
  } catch (err) {
    console.error(err);
  }
};
