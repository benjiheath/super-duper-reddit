import { RequestHandler } from 'express';
import { DbTables } from '../../common/types/dbTypes';
import { createPostSlugs } from '../../common/utils';
import { dbQuery, dbComments } from './../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const addCommentToPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator_user_id, post_id, body, creator_username } = req.body;

    const [comment] = await dbComments.insertRow({ creator_user_id, creator_username, post_id, body });

    console.log(comment);

    // const postWithCommentsPropertyAppended = { ...post, comments: [], urlSlugs };

    res.status(200).send({ status: 'posted successfully', comment });
  } catch (err) {
    console.error(err);
  }
};
