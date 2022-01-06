import { RequestHandler } from 'express';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { asyncMap, createSQLWhereConditionsFromList, insertPointsAndComments } from './../utils/misc';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { userId } = req.query;

    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments, points & userVoteStatus included
    const clientReadyPosts = await asyncMap(posts, (post) =>
      insertPointsAndComments(post, comments, userId as string)
    );

    res.status(200).send(clientReadyPosts);
  } catch (err) {
    console.log('servePosts err:', err);
    res.status(200).send(err);
  }
};
