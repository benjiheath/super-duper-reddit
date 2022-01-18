import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { dbUsers } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
    username?: string;
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

    const userId = await dbUsers.findValue('id').where('username').equals(username);

    // authenticate session
    req.session.userID = userId as string;
    req.session.username = username;

    res.status(201).send({ status: 'success', userId });
  } catch (error) {
    if (error instanceof FieldError) {
      res.status(200).send(error.info);
    } else {
      res.status(200).send({ msg: 'debugging', err: error });
    }
  }
};
