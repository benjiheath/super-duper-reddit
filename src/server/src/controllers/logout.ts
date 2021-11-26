import { RequestHandler } from 'express';

export const logout: RequestHandler = async (req, res, _): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).send({ status: 'ok', message: 'Logged out successfully' });
  });
};
