import express from 'express';
import {
  register,
  forgotPasswordHandler,
  resetPasswordTokenChecker,
  resetPasswordHandler,
} from '../handlers/user';

const router = express.Router();

router.post('/', register);
router.post('/account', forgotPasswordHandler);
router.get('/account/:token', resetPasswordTokenChecker);
router.patch('/account/:token', resetPasswordHandler);

export { router as userRouter };
