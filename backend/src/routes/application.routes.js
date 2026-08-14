import { Router } from 'express';
import { createScore } from '../controllers/scoresController.js';
import { getAdmissionAnalysis } from '../controllers/applicationController.js';

const router = Router();

// POST /scores - Crear registro de puntajes de ensayo / usuario
router.post('/scores', createScore);

// GET /applications/:id/admission_analysis - Análisis individual de postulación
router.get('/applications/:id/admission_analysis', getAdmissionAnalysis);

export default router;
