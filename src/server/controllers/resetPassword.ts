import { dbQuery } from './../utils/dbQueries';
import { RequestHandler } from 'express';
import { pool } from '../db';
import bcrypt from 'bcrypt';
import { DbTables } from '../../common/types/dbTypes';

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
    await pool.query('UPDATE users SET password = $1 WHERE reset_pw_token = $2', [hashedNewPassword, token]); // update pw
    await pool.query('UPDATE users SET reset_pw_token = NULL WHERE password = $1', [hashedNewPassword]); // delete token

    // get username so we can log user in / authenticate
    const username = await dbQuery(DbTables.users).findValue('username', 'password', hashedNewPassword);
    req.session.userID = username!;

    res.status(200).send({ status: 'success', username });
  } catch (error) {
    console.log('error', error);
  }
};
