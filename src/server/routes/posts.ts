import express from 'express';
import { addCommentToPost, createPost, servePosts } from '../controllers';

const router = express.Router();

router.get('/', servePosts);
router.post('/', createPost);
router.post('/comments', addCommentToPost);

export { router as postsRouter };
