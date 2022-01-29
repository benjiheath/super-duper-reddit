import { RequestHandler } from 'express';
import { dbPosts, dbComments } from '../../utils/dbQueries';
import { makePostClientReady } from '../../utils/responseShaping';

export const servePost: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { postSlugs } = req.query;

    const [post] = await dbPosts.selectAll({ whereConditions: `url_slugs = '${postSlugs}'` });

    if (!post) {
      res.status(404).send();
      return;
    }

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await makePostClientReady(post, comments, req.session.userID as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    res.status(500).send(err);
  }
};
