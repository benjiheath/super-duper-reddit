import { RequestHandler } from 'express';
import { dbPosts } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';

export const removePost: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.body;

    console.log('reqid', req.session.userID);

    const [postBelongsToUser] = await dbPosts.selectAll({
      whereConditions: `id = '${postId}' AND creator_user_id = '${req.session.userID}'`,
    });

    if (!postBelongsToUser) {
      res.status(401).send();
      return;
    }

    dbPosts.updateField('current_status', 'removed').whereColumnMatchesValue('id', postId);

    res.status(200).send();
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
  }
};
