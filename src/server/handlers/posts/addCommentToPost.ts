import { RequestHandler } from 'express';
import { dbComments, dbPosts } from '../../utils/dbQueries';
import { makePostClientReady } from '../../utils/responseShaping';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
  }
}

export const addCommentToPost: RequestHandler = async (req, res, next) => {
  try {
    const { creatorUserId, postId, body, creatorUsername, parentCommentId } = req.body;

    const commentData = {
      creator_user_id: creatorUserId,
      creator_username: creatorUsername,
      parent_comment_id: parentCommentId,
      body,
      post_id: postId,
    };

    await dbComments.insertRow(commentData);

    const [updatedPost] = await dbPosts.selectAll({ whereConditions: `id = '${postId}'` });
    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${postId}'`,
      orderBy: 'updated_at',
    });

    // const updatedPostWithComments = appendCommentsToPost(updatedPost, comments);

    const clientReadyPost = await makePostClientReady(updatedPost, comments, req.session.userID as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
