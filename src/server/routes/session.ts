import express from 'express';
import { sendSessionStatus, login, logout } from '../handlers/session';

const router = express.Router();

router.get('/', sendSessionStatus);
router.post('/', login);
router.delete('/', logout);

export { router as sessionRouter };
