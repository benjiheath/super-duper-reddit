import { dbQuery } from './../utils/dbQueries';
import { RequestHandler } from 'express';
import { DbTables } from '../../common/types/dbTypes';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator, title, body } = req.body;

    await dbQuery(DbTables.posts).insertRow({ creator, title, body });

    res.status(200).send({ data: 'posted' });
  } catch (err) {
    console.error(err);
  }
};
