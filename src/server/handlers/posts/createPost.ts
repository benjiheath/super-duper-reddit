import { RequestHandler } from 'express';
import { createPostSlugs } from '../../../common/utils';
import { dbPosts } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { creator_user_id, creator_username, title, body, contentUrl: content_url } = req.body;

    const [post] = await dbPosts.insertRow({
      creator_user_id,
      creator_username,
      content_url,
      title,
      body,
    });

    const urlSlugs = createPostSlugs(post.id, post.title);

    const postWithUrlSlugs = await dbPosts
      .updateField('url_slugs', urlSlugs)
      .whereColumnMatchesValue('id', post.id);

    const postWithCommentsPropertyAppended = { ...postWithUrlSlugs, comments: [] };

    res.status(200).send({ post: postWithCommentsPropertyAppended });
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
  }
};
