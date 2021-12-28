import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { FieldError } from '../utils/errors';
import { dbUsers } from './../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const register: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbUsers.insertRow({
      username,
      password: hashedPassword,
      email,
    });

    const userID = await dbUsers.findValue('id').where('username').equals(username);

    // authenticate session
    req.session.userID = username;

    res.status(201).send({ status: 'success', userID });
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
    }
  }
};
