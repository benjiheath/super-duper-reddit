import { RequestHandler } from 'express';
import { dbPosts, dbComments } from '../../utils/dbQueries';
import { createSQLWhereConditionsFromList, asyncMap } from '../../utils/misc';
import { makePostClientReady } from '../../utils/responseShaping';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments, points & userVoteStatus included
    const clientReadyPosts = await asyncMap(posts, (post) =>
      makePostClientReady(post, comments, req.session.userID as string)
    );

    res.status(200).send(clientReadyPosts);
  } catch (err) {
    res.status(500).send(err);
  }
};
