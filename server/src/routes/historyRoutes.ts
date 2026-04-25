import { Router } from 'express';
import { getHistory, saveHistory } from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/history', authMiddleware, getHistory);
router.post('/history', authMiddleware, saveHistory);

export default router;
