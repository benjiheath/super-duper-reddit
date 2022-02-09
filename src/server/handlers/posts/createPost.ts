import { RequestHandler } from 'express';
import { createPostSlugs } from '../../../common/utils';
import { dbPosts } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { creatorUserId, creatorUsername, title, body, contentUrl } = req.body;

    const [post] = await dbPosts.insertRow({
      creator_user_id: creatorUserId,
      creator_username: creatorUsername,
      content_url: contentUrl,
      title,
      body,
    });

    const urlSlugs = createPostSlugs(post.id, post.title);

    const postWithUrlSlugs = await dbPosts
      .updateField('url_slugs', urlSlugs)
      .whereColumnMatchesValue('id', post.id);

    const postWithCommentsPropertyAppended = { ...postWithUrlSlugs, comments: [] };

    res.status(200).send(postWithCommentsPropertyAppended);
  } catch (err) {
    err instanceof FieldError ? res.status(200).send(err.info) : res.status(500).send;
  }
};
