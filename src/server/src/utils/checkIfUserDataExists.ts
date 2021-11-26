import { pool } from '../db';
import { Response } from 'express-serve-static-core';

export const checkIfUserDataExists = async (username: string, email: string, res: Response): Promise<boolean> => {
  try {
    const { rows: DBuserMatches } = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
    const { rows: dbEmailMatches } = await pool.query('SELECT email FROM users WHERE email = $1', [email]);

    if (DBuserMatches.length >= 1 && dbEmailMatches.length >= 1) {
      res.status(200).send({
        status: 'fail',
        message: 'Username & Email both already exist',
        errors: [
          { field: 'username', message: 'Username already exists' },
          { field: 'email', message: 'Email already exists' },
        ],
      });
      return true;
    }

    if (DBuserMatches.length >= 1) {
      res.status(200).send({
        status: 'fail',
        message: 'Username already exists.',
        errors: [{ field: 'username', message: 'Username already exists' }],
      });
      return true;
    }

    if (dbEmailMatches.length >= 1) {
      res.status(200).send({
        status: 'fail',
        message: 'Email already exists.',
        errors: [{ field: 'email', message: 'Email already exists' }],
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
