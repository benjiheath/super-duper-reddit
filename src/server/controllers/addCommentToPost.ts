import { RequestHandler } from 'express';
import { DbTables } from '../types/dbTypes';
import { createPostSlugs } from '../../common/utils';
import { appendCommentsAndSlugsToPost } from '../utils/misc';
import { dbQuery, dbComments, dbPosts } from './../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const addCommentToPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator_user_id, post_id, body, creator_username } = req.body;

    await dbComments.insertRow({ creator_user_id, creator_username, post_id, body });

    const [updatedPost] = await dbPosts.selectAll({ whereConditions: `id = '${post_id}'` });
    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post_id}'`,
      orderBy: 'updated_at',
    });

    const updatedPostWithComments = appendCommentsAndSlugsToPost(updatedPost, comments);

    res.status(200).send({ status: 'posted successfully', post: updatedPostWithComments });
  } catch (err) {
    console.error(err);
  }
};
