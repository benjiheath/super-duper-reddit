import express from 'express';
import { userService, sessionService } from '../../main';
import { Handler } from '../../types/utils';
import { getWrappedHandlers } from './../../utils/misc.utils';
import {
  ForgotPasswordRequest,
  LoginResponse,
  PasswordResetRequest,
  RegisterRequest,
} from './../../../common/types/fetching';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    username: string;
  }
}

type Handlers = {
  register: Handler.WithBody<RegisterRequest, LoginResponse>;
  forgotPassword: Handler.WithBody<ForgotPasswordRequest>;
  resetPassword: Handler.WithBody<PasswordResetRequest, LoginResponse>;
};

const handlers: Handlers = {
  register: async (req, res) => {
    const { id: userId, username } = await userService.registerUser(req.body);
    await sessionService.authenticateUser(req, userId);

    res.status(201).send({ status: 'success!', userId, username });
  },

  forgotPassword: async (req, res) => {
    const targetRecoveryEmail = userService.handleForgotPassword(req.body);

    res.status(200).send(targetRecoveryEmail);
  },

  resetPassword: async (req, res) => {
    const { newPassword, token } = req.body;

    await userService.checkUserResetPasswordTokenValidity(token);
    const updatedUser = await userService.resetPassword({ token, newPassword });
    await sessionService.authenticateUser(req, updatedUser.id);

    res.status(200).send({
      status: 'success!',
      userId: updatedUser.id,
      username: updatedUser.username,
    });
  },
};

const wrappedHandlers = getWrappedHandlers(handlers);

const userRouter = express.Router();

userRouter.post('/', wrappedHandlers.register);
userRouter.post('/account', wrappedHandlers.forgotPassword);
userRouter.patch('/account/:token', wrappedHandlers.resetPassword);

export { userRouter };
