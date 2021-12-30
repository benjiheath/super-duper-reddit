import { RequestHandler } from 'express';
import { createPostSlugs } from '../../common/utils';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { createSQLWhereConditionsFromList } from './../utils/misc';

export const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments included
    const postsIncludingComments = posts.map((post) => {
      const urlSlugs = createPostSlugs(post.id, post.title);
      const postComments = comments.filter((comment) => comment.post_id === post.id);
      return {
        ...post,
        comments: postComments,
        urlSlugs,
      };
    });

    res.status(200).send({ posts: postsIncludingComments });
  } catch (err) {
    console.log(err);
  }
};
