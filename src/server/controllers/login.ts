import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { DbTables } from '../../common/types/dbTypes';
import { pool } from '../db';
import { dbQuery } from '../utils/dbQueries';
import { FieldError } from '../utils/errors';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const login: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { username, password } = req.body;

    const userQuery = dbQuery(DbTables.users);

    const { id, password: hashedPassword } = await userQuery.findValues(
      ['id', 'password'],
      'username',
      username
    );

    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      req.session.userID = username;
      res.status(200).send({
        status: 'success',
        auth: true,
        id,
      });
    } else {
      res.status(200).send({
        status: 'fail',
        message: 'Invalid password',
        errors: [
          {
            field: 'password',
            message: 'Invalid password',
          },
        ],
      });
    }
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
    }
  }
};
