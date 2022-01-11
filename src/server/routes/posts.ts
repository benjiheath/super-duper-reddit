import express from 'express';
import {
  servePosts,
  servePost,
  createPost,
  addCommentToPost,
  updatePostVotes,
  removePost,
  addFavorite,
  removeFavorite,
} from '../handlers/posts';

const router = express.Router();

router.get('/', servePosts);
router.get('/post', servePost);
router.post('/', createPost);
router.post('/comments', addCommentToPost);
router.post('/favorites', addFavorite);
router.patch('/votes', updatePostVotes);
router.delete('/', removePost);
router.delete('/favorites', removeFavorite);

export { router as postsRouter };
