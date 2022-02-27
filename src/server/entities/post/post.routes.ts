import express, { RequestHandler } from 'express';
import { pool } from '../../database/db';
import { FieldError } from '../../utils/errors';
import { createPostSlugs } from '../../../common/utils';
import { makePostClientReady, makeCommentClientReady } from '../../utils/responseShaping';
import { createSQLWhereConditionsFromList, asyncMap, sanitizeKeys } from '../../utils/misc';
import { dbPosts, dbComments, dbPostsFavorites, dbPostsVotes, dbCommentsVotes } from '../../utils/dbQueries';

const servePosts: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const posts = await dbPosts.selectAll({ orderBy: 'updated_at' });

    // concatenating 'comments.post_id = post.id' conditions for comments query below
    const whereConditions = createSQLWhereConditionsFromList(posts, 'post_id', 'id');

    // get all comments that are children of the retrieved posts
    const comments = await dbComments.selectAll({ whereConditions, orderBy: 'updated_at' });

    // combining data into list where each post has its comments, points & userVoteStatus included
    const clientReadyPosts = await asyncMap(posts, (post) =>
      makePostClientReady(post, comments, req.session.userID as string)
    );

    res.status(200).send(clientReadyPosts);
  } catch (err) {
    res.status(500).send();
  }
};

const servePost: RequestHandler = async (req, res, _): Promise<void> => {
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
    console.error('servePost error:', err);
    res.status(500).send(err);
  }
};

const createPost: RequestHandler = async (req, res, next) => {
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

const addCommentToPost: RequestHandler = async (req, res, next) => {
  try {
    const { creatorUserId, postId, body, creatorUsername, parentCommentId } = req.body;

    const commentData = {
      creator_user_id: creatorUserId,
      creator_username: creatorUsername,
      parent_comment_id: parentCommentId,
      body,
      post_id: postId,
    };

    await dbComments.insertRow(commentData);

    const [updatedPost] = await dbPosts.selectAll({ whereConditions: `id = '${postId}'` });
    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${postId}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await makePostClientReady(updatedPost, comments, req.session.userID as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const addFavorite: RequestHandler = async (req, res, _): Promise<void> => {
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

const editPost: RequestHandler = async (req, res, next) => {
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

const updatePostVotes: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { voteValue, postId } = req.body;

    await dbPostsVotes
      .insertRow({
        vote_status: voteValue,
        user_id: req.session.userID,
        post_id: postId,
      })
      .onConflict(['post_id', 'user_id'])
      .doUpdateColumn('vote_status')
      .withValue(voteValue)
      .go();

    const [post] = await dbPosts.selectAll({ whereConditions: `id = '${postId}'` });

    const comments = await dbComments.selectAll({
      whereConditions: `post_id = '${post.id}'`,
      orderBy: 'updated_at',
    });

    const clientReadyPost = await makePostClientReady(post, comments, req.session.userID as string);

    res.status(200).send(clientReadyPost);
  } catch (err) {
    console.log('updatePostVotes err:', err);
    res.status(500).send();
  }
};

const updateCommentVotes: RequestHandler = async (req, res, _): Promise<void> => {
  try {
    const { voteValue, commentId } = req.body;

    await dbCommentsVotes.insertRow(
      {
        vote_status: voteValue,
        user_id: req.session.userID,
        comment_id: commentId,
      },
      `ON CONFLICT (comment_id, user_id) DO UPDATE SET vote_status = '${voteValue}'`
    );

    const [comment] = await dbComments.selectAll({ whereConditions: `id = '${commentId}'` });

    const updatedComment = await makeCommentClientReady(comment, req.session.userID as string);

    res.status(200).send(updatedComment);
  } catch (err) {
    res.status(500).send(err);
  }
};

const removePost: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.body;

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
      res.status(500).send();
    }
  }
};

const router = express.Router();

router.get('/', servePosts);
router.get('/post', servePost);
router.post('/', createPost);
router.post('/comments', addCommentToPost);
router.post('/favorites', addFavorite);
router.patch('/post', editPost);
router.patch('/votes', updatePostVotes);
router.patch('/comments/votes', updateCommentVotes);
router.delete('/', removePost);

export { router as postsRouter };
