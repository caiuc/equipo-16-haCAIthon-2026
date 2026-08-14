import { Router } from 'express';
import simulationRoutes from './simulation.routes.js';
import careerRoutes from './career.routes.js';

const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend HaCAIthon API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
apiRouter.use('/simulaciones', simulationRoutes);
apiRouter.use('/carreras', careerRoutes);

export default apiRouter;
