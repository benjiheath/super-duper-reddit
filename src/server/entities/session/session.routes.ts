import express, { RequestHandler } from 'express';
import { LoginRequest } from '../../database/database.types';
import { asyncWrap } from './../../utils/misc.utils';
import { sessionService } from './session.service';

const login = asyncWrap<LoginRequest, any>(async (req, res) => {
  const authenticatedUser = await sessionService.login(req);

  res.status(200).send({ status: 'success', userId: authenticatedUser.id });
});

const logout: RequestHandler = async (req, res, _): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).send({ status: 'ok', message: 'Logged out successfully' });
  });
};

const router = express.Router();

router.post('/', login);
router.delete('/', logout);

export { router as sessionRouter };
