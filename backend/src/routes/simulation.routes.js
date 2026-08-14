import { Router } from 'express';
import { runSimulation, getAISummary } from '../controllers/simulation.controller.js';

const router = Router();

// POST /api/simulaciones - Ejecuta la simulación con los 3 esquemas (+ IA opcional con includeAI: true)
router.post('/', runSimulation);

// POST /api/simulaciones/ia-resumen - Genera el resumen con IA a partir de resultados previos
router.post('/ia-resumen', getAISummary);

export default router;
