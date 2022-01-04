import { RequestHandler } from 'express';
import { FieldError } from '../utils/errors';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { appendCommentsToPost, createSQLWhereConditionsFromList } from './../utils/misc';

export const servePost: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { postSlugs } = req.params;

    const [post] = await dbPosts.selectAll({ whereConditions: `url_slugs = '${postSlugs}'` });

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });
    const postIncludingComments = appendCommentsToPost(post, comments);

    res.status(200).send(postIncludingComments);
  } catch (err) {
    res.status(200).send(err);
  }
};
