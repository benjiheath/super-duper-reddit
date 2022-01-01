import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { DbTables } from '../types/dbTypes';
import { dbQuery, dbUsers } from './../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const resetPasswordHandler: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // update password
    await dbUsers.updateField('password', hashedNewPassword).whereColumnMatchesValue('reset_pw_token', token);
    // delete token
    await dbUsers.updateField('reset_pw_token', token).whereColumnMatchesValue('reset_pw_token', token);

    // get username so we can log user in / authenticate
    const username = await dbUsers.findValue('username').where('password').equals(hashedNewPassword);
    req.session.userID = username;

    res.status(200).send({ status: 'success', username });
  } catch (error) {
    console.log('error', error);
  }
};
