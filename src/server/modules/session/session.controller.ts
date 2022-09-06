import express from 'express';
import { getWrappedHandlers } from './../../utils/misc.utils';
import { Handler } from './../../types/utils';
import { LoginRequest, LoginResponse } from './../../../common/types/fetching';
import { sessionService } from '../../main';

type Handlers = {
  login: Handler.WithBody<LoginRequest, LoginResponse>;
  logout: Handler.NoArgs;
};

const handlers: Handlers = {
  login: async (req, res) => {
    const authenticatedUser = await sessionService.login(req);

    res.status(200).send({
      status: 'success',
      userId: authenticatedUser.id,
      username: authenticatedUser.username,
    });
  },

  logout: async (req, res, _): Promise<void> => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid').status(200).send({ status: 'ok', message: 'Logged out successfully' });
    });
  },
};

const wrappedHandlers = getWrappedHandlers(handlers);

const sessionRouter = express.Router();

sessionRouter.post('/', wrappedHandlers.login);
sessionRouter.delete('/', wrappedHandlers.logout);

export { sessionRouter };
