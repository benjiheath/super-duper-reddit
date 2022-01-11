import { RequestHandler } from 'express';
import { pool } from '../../db';

export const resetPasswordTokenChecker: RequestHandler = async (req, res, _): Promise<void> => {
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
