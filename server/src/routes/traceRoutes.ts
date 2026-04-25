import { Router } from 'express';
import { getAlgorithmTrace } from '../controllers/traceController.js';

const router = Router();

router.post('/trace', getAlgorithmTrace);

export default router;
