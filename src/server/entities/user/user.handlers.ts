import { RequestHandler } from 'express';
import { FieldError } from '../../utils/errors';
import { userService } from './user.service';
import bcrypt from 'bcrypt';
import { dbUsers } from '../../utils/dbQueries';
import { pool } from '../../database/db';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { UserColumn } from '../../types/dbTypes';
import { sendRecEmail_test } from '../../utils/sendRecEmail_test';

interface Cock {
  register: RequestHandler;
  forgotPassword: RequestHandler;
  resetPassword: RequestHandler;
  checkResetPasswordToken: RequestHandler;
}

const userHandlers: Cock = {
  register: async (req, res, _) => {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userService.createUser({ username, password: hashedPassword, email });

      // authenticate session
      req.session.userID = newUser.id;
      req.session.username = username;

      res.status(201).send({ status: 'success', userId: newUser.id });
    } catch (error) {
      if (error instanceof FieldError) {
        res.status(200).send(error.info);
      } else {
        res.status(200).send({ msg: 'debugging', err: error });
      }
    }
  },
};

class UserHandler implements Cock {
  //   constructor() {}

  async register(req, res, _) {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userService.createUser({ username, password: hashedPassword, email });

      // authenticate session
      req.session.userID = newUser.id;
      req.session.username = username;

      res.status(201).send({ status: 'success', userId: newUser.id });
    } catch (error) {
      if (error instanceof FieldError) {
        res.status(200).send(error.info);
      } else {
        res.status(200).send({ msg: 'debugging', err: error });
      }
    }
  }

  forgotPassword: RequestHandler = async (req, res, _): Promise<void> => {
    try {
      const [idType] = Object.keys(req.body) as UserColumn[];
      const [id]: string[] = Object.values(req.body);
      const token = uuidv4();

      await dbUsers.findValue(idType).where(idType).equals(id);

      await dbUsers.updateField('reset_pw_token', token).whereColumnMatchesValue(idType, id);

      const targetEmail =
        idType === 'email'
          ? id
          : await dbUsers
              .findValue('email')
              .where(`${idType as UserColumn}`)
              .equals(id);

      const link = `<a href='${config.urls.client}/reset-password/${token}' target="_blank">Reset password</a>`;
      await sendRecEmail_test(targetEmail as string, link);

      res.status(200).send({ status: 'ok', message: 'Email sent!', sentTo: targetEmail });
    } catch (error) {
      if (error instanceof FieldError) {
        res.status(200).send(error.info);
        console.info('Error with recovery-email ID submission:', error.info);
      }
    }
  };

  resetPassword: RequestHandler = async (req, res, _): Promise<void> => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // update password
      await dbUsers
        .updateField('password', hashedNewPassword)
        .whereColumnMatchesValue('reset_pw_token', token);
      // delete token
      await dbUsers.updateField('reset_pw_token', token).whereColumnMatchesValue('reset_pw_token', token);

      // get username so we can log user in / authenticate
      const username = await dbUsers.findValue('username').where('password').equals(hashedNewPassword);
      req.session.userID = username as string;

      res.status(200).send({ status: 'success', username });
    } catch (error) {
      console.log('error', error);
    }
  };

  checkResetPasswordToken: RequestHandler = async (req, res, _): Promise<void> => {
    try {
      // ensure token is valid
      const { token } = req.params;
      const tokenCheck = await pool.query('SELECT FROM users WHERE reset_pw_token = $1', [token]);
      if (tokenCheck.rows.length < 1) {
        res.status(200).send({ status: 'fail', message: 'tok' });
        return;
      }

      res.status(200).send();
    } catch (error) {
      console.log('error', error);
    }
  };
}
