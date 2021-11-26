import express from 'express';
import { login, logout, sendSessionStatus } from '../controllers';

const router = express.Router();

router.get('/', sendSessionStatus);
router.post('/', login);
router.delete('/', logout);

export { router as sessionRouter };
