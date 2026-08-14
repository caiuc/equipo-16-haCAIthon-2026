import { Router } from 'express';
import { getCareers } from '../controllers/career.controller.js';

const router = Router();

// GET /api/carreras - Obtiene la lista de carreras y cortes (soporta query params ?carrera=...&universidad=...)
router.get('/', getCareers);

export default router;
