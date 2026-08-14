import { executeSimulation } from '../services/simulation.service.js';
import { generateEducationalSummary } from '../services/ai.service.js';

/**
 * Controlador para ejecutar la simulación de los 3 esquemas
 * POST /api/simulaciones
 */
export const runSimulation = async (req, res, next) => {
  try {
    const { scores, careerInterest, universityInterest, includeAI = false } = req.body;

    // Validación no destructiva
    if (!careerInterest) {
      return res.status(400).json({
        success: false,
        message: 'El campo "careerInterest" (carrera de interés) es obligatorio.',
      });
    }

    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'El objeto "scores" con los puntajes (nem, ranking, lenguaje, mat1, etc.) es obligatorio.',
      });
    }

    // Ejecutar lógica de los 3 esquemas
    const simulationResults = await executeSimulation({
      scores,
      careerInterest,
      universityInterest,
    });

    let aiSummary = null;
    if (includeAI) {
      aiSummary = await generateEducationalSummary(simulationResults);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...simulationResults,
        ...(includeAI && { aiSummary }),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador específico para obtener el resumen de IA dado un cálculo de simulación
 * POST /api/simulaciones/ia-resumen
 */
export const getAISummary = async (req, res, next) => {
  try {
    const { simulationData } = req.body;

    if (!simulationData) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar "simulationData" para generar el resumen con IA.',
      });
    }

    const summary = await generateEducationalSummary(simulationData);

    return res.status(200).json({
      success: true,
      data: {
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
};
