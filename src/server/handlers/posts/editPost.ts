import { RequestHandler } from 'express';
import _ from 'lodash';
import { pool } from '../../db';
import { dbComments } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';
import { sanitizeKeys } from '../../utils/misc';
import { makePostClientReady } from '../../utils/responseShaping';

export const editPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, body, contentUrl: content_url, postSlugs } = req.body;

    const { rows } = await pool.query(
      `UPDATE posts 
        SET title = $1, body = $2, content_url = $3 
        WHERE url_slugs = '${postSlugs}' AND creator_user_id = '${req.session.userID}' 
        RETURNING *`,
      [title, body, content_url]
    );

    const [postWithSanitizedKeys] = rows.map((row) => sanitizeKeys(row));

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${postWithSanitizedKeys.id}'`,
      orderBy: 'updated_at',
    });

    const updatedPost = await makePostClientReady(postWithSanitizedKeys, comments, req.session.userID!);

    res.status(200).send(updatedPost);
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
    // TODO handle invalid session ID (not auth)
  }
};
