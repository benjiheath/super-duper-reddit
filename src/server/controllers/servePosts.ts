import { RequestHandler } from 'express';
import { FieldError } from '../utils/errors';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { appendCommentsAndSlugsToPost, createSQLWhereConditionsFromList } from './../utils/misc';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments included
    const postsIncludingComments = posts.map((post) => appendCommentsAndSlugsToPost(post, comments));

    res.status(200).send({ posts: postsIncludingComments });
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
  }
};
