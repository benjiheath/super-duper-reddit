import express from 'express';
import { addCommentToPost, createPost, servePost, servePosts } from '../controllers';

const router = express.Router();

router.get('/', servePosts);
router.get('/:postSlugs', servePost);
router.post('/', createPost);
router.post('/comments', addCommentToPost);

export { router as postsRouter };
