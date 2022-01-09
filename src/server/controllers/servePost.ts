import { RequestHandler } from 'express';
import { dbComments, dbPosts } from './../utils/dbQueries';
import { insertPointsAndComments } from './../utils/misc';

export const servePost: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { userId, postSlugs } = req.query;

    const [post] = await dbPosts.selectAll({ whereConditions: `url_slugs = '${postSlugs}'` });

    if (!post) {
      res.status(404).send();
      return;
    }

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await insertPointsAndComments(post, comments, userId as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    res.status(200).send(err);
  }
};
