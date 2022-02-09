import { RequestHandler } from 'express';
import { pool } from '../../db';
import { dbPostsFavorites } from '../../utils/dbQueries';

export const addFavorite: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { postId } = req.body;

    const whereConditions = `post_id = '${postId}' AND user_id = '${req.session.userID}'`;

    const [existingVote] = await dbPostsFavorites.selectAll({
      whereConditions,
    });

    const query = existingVote
      ? await (
          await pool.query(`DELETE FROM posts_favorites WHERE ${whereConditions} `)
        ).rows[0]
      : await dbPostsFavorites.insertRow({ post_id: postId, user_id: req.session.userID });

    // if the favorite was deleted, query will be undefined, so send FALSE to user.
    const updatedUserFavoriteStatus = query ? true : false;

    res.status(200).send({ updatedUserFavoriteStatus });
  } catch (err) {
    res.status(500).send();
  }
};
