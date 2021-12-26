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

    const userQuery = dbQuery(DbTables.users);
    const PostsQuery = dbQuery(DbTables.threads);

    const creator_user_id = await userQuery.findValue('id', 'username', creator);

    console.log({ creator });
    console.log({ creator_user_id });

    await PostsQuery.insertRow({ creator_user_id, title, body });

    res.status(200).send({ data: 'posted' });
  } catch (err) {
    console.error(err);
  }
};
