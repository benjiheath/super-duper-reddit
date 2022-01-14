import { RequestHandler } from 'express';
import _ from 'lodash';
import { pool } from '../../db';
import { dbComments } from '../../utils/dbQueries';
import { FieldError } from '../../utils/errors';
import { insertPointsAndComments, sanitizeKeys } from '../../utils/misc';

export const editPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, body, contentUrl: content_url, postSlugs } = req.body;

    const { rows } = await pool.query(
      `UPDATE posts 
        SET title = '${title}', body = '${body}', content_url = '${content_url}' 
        WHERE url_slugs = '${postSlugs}' AND creator_user_id = '${req.session.userID}' 
        RETURNING *`
    );

    const [postWithSanitizedKeys] = rows.map((row) => sanitizeKeys(row));

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${postWithSanitizedKeys.id}'`,
      orderBy: 'updated_at',
    });

    const updatedPost = await insertPointsAndComments(postWithSanitizedKeys, comments, req.session.userID!);

    res.status(200).send(updatedPost);
  } catch (err) {
    if (err instanceof FieldError) {
      res.status(200).send(err.info);
    }
  }
};
