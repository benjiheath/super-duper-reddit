import express, { RequestHandler } from 'express';
import { LoginRequest } from '../../database/database.types';
import { sessionService } from '../../main';
import { asyncWrap } from '../../utils/misc.utils';

const login = asyncWrap<LoginRequest, any>(async (req, res) => {
  const authenticatedUser = await sessionService.login(req);

  res.status(200).send({ status: 'success', userId: authenticatedUser.id });
});

const logout: RequestHandler = async (req, res, _): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).send({ status: 'ok', message: 'Logged out successfully' });
  });
};

const sessionRouter = express.Router();

sessionRouter.post('/', login);
sessionRouter.delete('/', logout);

export { sessionRouter };
