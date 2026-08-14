import { Router } from 'express';

import {
  getCareerRecommendations
} from '../controllers/recommendation.controller.js';


const router = Router();


router.get(
  '/career-recommendations',
  getCareerRecommendations
);


export default router;