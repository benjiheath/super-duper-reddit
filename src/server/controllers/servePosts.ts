import { RequestHandler } from 'express';
import { FieldError } from '../utils/errors';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { appendCommentsToPost, createSQLWhereConditionsFromList } from './../utils/misc';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments included
    const postsIncludingComments = posts.map((post) => appendCommentsToPost(post, comments));

    res.status(200).send(postsIncludingComments);
  } catch (err) {
    res.status(200).send(err);
  }
};
