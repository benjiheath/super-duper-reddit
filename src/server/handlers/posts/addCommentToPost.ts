import { RequestHandler } from 'express';
import { dbComments, dbPosts } from '../../utils/dbQueries';
import { appendCommentsToPost } from '../../utils/misc';

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

    const updatedPostWithComments = appendCommentsToPost(updatedPost, comments);

    res.status(200).send({ status: 'posted successfully', post: updatedPostWithComments });
  } catch (err) {
    console.error(err);
  }
};
