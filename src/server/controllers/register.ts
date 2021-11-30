import { dbQuery } from './../utils/dbQueries';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { DbTables } from '../../common/types/dbTypes';
import { FieldError } from '../utils/errors';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const register: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbQuery(DbTables.users).insertRow({
      username,
      password: hashedPassword,
      email,
    });

    // authenticate session
    req.session.userID = username;

    res.status(201).send({ status: 'success' });
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
    }
  }
};
