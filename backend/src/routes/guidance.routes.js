import { Router } from 'express';

import {
  getCareerGuidance
} from '../controllers/guidance.controller.js';

const router = Router();

router.post(
  '/career-guidance',
  getCareerGuidance
);

export default router;