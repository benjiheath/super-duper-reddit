import { RequestHandler } from 'express';
import { DbTables } from '../types/dbTypes';
import { insertRow } from '../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator, title, body } = req.body;

    await insertRow({ table: DbTables.posts, columns: { creator, title, body } });

    res.status(200).send({ data: 'posted' });
  } catch (err) {
    console.error(err);
  }
};
