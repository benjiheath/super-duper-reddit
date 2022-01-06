import express from 'express';
import { addCommentToPost, createPost, servePost, servePosts, updatePostVotes } from '../controllers';

const router = express.Router();

router.get('/', servePosts);
router.get('/post', servePost);
router.post('/', createPost);
router.post('/comments', addCommentToPost);
router.patch('/votes', updatePostVotes);

export { router as postsRouter };
