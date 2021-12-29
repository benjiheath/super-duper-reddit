import { PostWithComments } from './../../common/types/dbTypes';
import { createWhereConditionsFromList } from './../utils/misc';
import { dbPosts, dbComments } from './../utils/dbQueries';
import { RequestHandler } from 'express';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments included
    const postsIncludingComments = posts.map((post) => {
      const postComments = comments.filter((comment) => comment.post_id === post.id);
      return {
        ...post,
        comments: postComments,
      };
    });

    res.status(200).send({ posts: postsIncludingComments });
  } catch (err) {
    console.log(err);
  }
};
