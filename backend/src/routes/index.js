import { Router } from 'express';

import simulationRoutes from './simulation.routes.js';
import careerRoutes from './career.routes.js';
import catalogRoutes from './catalog.routes.js';
import applicationRoutes from './application.routes.js';
import summaryRoutes from './summary.routes.js';
import guidanceRoutes from './guidance.routes.js';
import { getThreeTiersRecommendations } from '../controllers/simulation.controller.js';

const apiRouter = Router();

// ======================================================
// Health check
// ======================================================
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend HaCAIthon API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint directo de recomendaciones de 3 niveles (/recomendaciones y /api/recomendaciones)
apiRouter.post('/recomendaciones', getThreeTiersRecommendations);
apiRouter.get('/recomendaciones', getThreeTiersRecommendations);

// ======================================================
// Catálogos (/universities, /career_types, /careertypes, /majors, /majors/:major_id/requirements)
// ======================================================
apiRouter.use(catalogRoutes);

// ======================================================
// Postulaciones y puntajes (/scores, /applications, /applications/:id/admission_analysis)
// ======================================================
apiRouter.use(applicationRoutes);

// ======================================================
// Búsqueda de carreras (/carreras)
// ======================================================
apiRouter.use('/carreras', careerRoutes);

// ======================================================
// Simulación (/simulaciones, /simulaciones/recomendaciones, /simulaciones/ia-resumen)
// ======================================================
apiRouter.use('/simulaciones', simulationRoutes);

// ======================================================
// Resúmenes (/summaries)
// ======================================================
apiRouter.use(summaryRoutes);

// ======================================================
// Orientación universitaria con IA (/career-guidance)
// ======================================================
apiRouter.use(guidanceRoutes);

export default apiRouter;