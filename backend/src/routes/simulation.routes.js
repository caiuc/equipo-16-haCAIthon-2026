import { Router } from 'express';
import {
  runSimulation,
  getAISummary,
  getThreeTiersRecommendations,
} from '../controllers/simulation.controller.js';

const router = Router();

// POST /simulaciones/recomendaciones - Las 3 categorías (Aspiracional, Mejor alcanzable, Otras de menor corte)
router.post('/recomendaciones', getThreeTiersRecommendations);

// POST /simulaciones - Ejecuta la simulación con los 3 esquemas (+ IA opcional con includeAI: true)
router.post('/', runSimulation);

// POST /simulaciones/ia-resumen - Genera el resumen con IA a partir de resultados previos
router.post('/ia-resumen', getAISummary);

export default router;
