import { RequestHandler } from 'express';
import { dbPostsVotes, dbPosts, dbComments } from '../../utils/dbQueries';
import { insertPointsAndComments } from '../../utils/misc';

export const updatePostVotes: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { voteValue, postId, userId } = req.body;

    await dbPostsVotes.insertRow(
      {
        vote_status: voteValue,
        user_id: userId,
        post_id: postId,
      },
      `ON CONFLICT (post_id, user_id) DO UPDATE SET vote_status = '${voteValue}'`
    );

    const [post] = await dbPosts.selectAll({ whereConditions: `id = '${postId}'` });

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await insertPointsAndComments(post, comments, userId);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    console.log('VOTES ERR', err);
    res.status(403).send(err);
  }
};
