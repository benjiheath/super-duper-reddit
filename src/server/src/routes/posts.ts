import express from 'express';
import { createPost, test } from '../controllers';

const router = express.Router();

router.get('/', test);
router.post('/', createPost);

export { router as postsRouter };
