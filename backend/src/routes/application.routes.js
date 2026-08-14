import { Router } from 'express';

import {
  createApplication,
  getAdmissionAnalysis
} from '../controllers/applicationController.js';

import { createScore } from '../controllers/scoresController.js';

const router = Router();


// POST /applications
// Crear una postulación para un usuario
router.post('/applications', createApplication);


// POST /scores
// Crear registro de puntajes asociado a una postulación
router.post('/scores', createScore);


// GET /applications/:id/admission_analysis
// Análisis individual de postulación
router.get(
  '/applications/:id/admission_analysis',
  getAdmissionAnalysis
);

export default router;