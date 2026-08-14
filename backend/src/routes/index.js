import { Router } from 'express';

import simulationRoutes from './simulation.routes.js';
import careerRoutes from './career.routes.js';
import catalogRoutes from './catalog.routes.js';
import applicationRoutes from './application.routes.js';
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

// Rutas de Catálogos (/universities, /career_types, /majors, /majors/:major_id/requirements)
apiRouter.use(catalogRoutes);


// ======================================================
// Postulaciones y puntajes
//
// POST /applications
// POST /scores
// GET  /applications/:id/admission_analysis
// ======================================================

apiRouter.use(applicationRoutes);


// ======================================================
// Búsqueda de carreras
//
// GET /carreras
// ======================================================

apiRouter.use('/carreras', careerRoutes);


// ======================================================
// Simulación
//
// POST /simulaciones
// POST /simulaciones/ia-resumen
// ======================================================

apiRouter.use('/simulaciones', simulationRoutes);


// ======================================================
// Resúmenes
//
// POST /summaries
// ======================================================

apiRouter.use(summaryRoutes);


// ======================================================
// Orientación universitaria con IA
//
// POST /career-guidance
// ======================================================

apiRouter.use(guidanceRoutes);


export default apiRouter;