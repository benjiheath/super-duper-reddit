import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { DbTables } from '../../common/types/dbTypes';
import { dbQuery } from './../utils/dbQueries';

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

    // await pool.query('UPDATE users SET password = $1, reset_pw_token = NULL WHERE reset_pw_token = $2', [
    //   hashedNewPassword,
    //   token,
    // ]);

    const userQuery = dbQuery(DbTables.users);
    // update password
    await userQuery
      .updateField('password', hashedNewPassword)
      .whereColumnMatchesValue('reset_pw_token', token);
    // delete token
    await userQuery.updateField('reset_pw_token', token).whereColumnMatchesValue('reset_pw_token', token);

    // get username so we can log user in / authenticate
    const username = await userQuery.findValue('username', 'password', hashedNewPassword);
    req.session.userID = username;

    res.status(200).send({ status: 'success', username });
  } catch (error) {
    console.log('error', error);
  }
};
