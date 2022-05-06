import express from 'express';
import { CreateDbUserDto, ForgotPasswordRequest, PasswordResetRequest } from '../../database/database.types';
import { userService, sessionService } from '../../main';
import { asyncWrap } from '../../utils/misc.utils';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
    username?: string;
  }
}

const register = asyncWrap<CreateDbUserDto, any>(async (req, res) => {
  const { id: userId } = await userService.registerUser(req.body);
  await sessionService.authenticateUser(req, userId);
  res.status(201).send({ status: 'success', userId });
});

const forgotPassword = asyncWrap<ForgotPasswordRequest>(async (req, res) => {
  const targetRecoveryEmail = userService.handleForgotPassword(req.body);
  res.status(200).send(targetRecoveryEmail);
});

const resetPassword = asyncWrap<PasswordResetRequest, any>(async (req, res) => {
  const [{ token }, { newPassword }] = [req.params, req.body];

  await userService.checkUserResetPasswordTokenValidity(token);

  const updatedUser = await userService.resetPassword({ token, newPassword });
  await sessionService.authenticateUser(req, updatedUser.id);

  res.status(200).send(updatedUser.username);
});

const userRouter = express.Router();

userRouter.post('/', register);
userRouter.post('/account', forgotPassword);
userRouter.patch('/account/:token', resetPassword);

export { userRouter };
