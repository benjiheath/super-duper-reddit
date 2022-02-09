import { RequestHandler } from 'express';
import { dbPostsVotes, dbPosts, dbComments } from '../../utils/dbQueries';
import { makePostClientReady } from '../../utils/responseShaping';

export const updatePostVotes: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { voteValue, postId } = req.body;

    await dbPostsVotes.insertRow(
      {
        vote_status: voteValue,
        user_id: req.session.userID,
        post_id: postId,
      },
      `ON CONFLICT (post_id, user_id) DO UPDATE SET vote_status = '${voteValue}'`
    );

    const [post] = await dbPosts.selectAll({ whereConditions: `id = '${postId}'` });

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await makePostClientReady(post, comments, req.session.userID as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    res.status(500).send();
  }
};
