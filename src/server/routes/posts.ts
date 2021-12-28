import express from 'express';
import { createPost, servePosts } from '../controllers';

const router = express.Router();

router.get('/', servePosts);
router.post('/', createPost);

export { router as postsRouter };
