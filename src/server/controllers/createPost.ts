import { RequestHandler } from 'express';
import { createPostSlugs } from '../../common/utils';
import { FieldError } from '../utils/errors';
import { dbPosts } from './../utils/dbQueries';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator_user_id, creator_username, title, body } = req.body;

    const [post] = await dbPosts.insertRow({
      creator_user_id,
      creator_username,
      title,
      body,
    });

    const urlSlugs = createPostSlugs(post.id, post.title);

    const postWithCommentsPropertyAppended = { ...post, comments: [], urlSlugs };

    res.status(200).send({ status: 'posted successfully', post: postWithCommentsPropertyAppended });
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
  }
};
