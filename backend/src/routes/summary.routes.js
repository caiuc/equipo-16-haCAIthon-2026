import { Router } from 'express';
import { createSummary } from '../controllers/summary.controller.js';

const router = Router();

// POST /summaries
router.post('/summaries', createSummary);

export default router;