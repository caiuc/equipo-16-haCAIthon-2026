import { executeSimulation } from '../services/simulation.service.js';
import { generateEducationalSummary } from '../services/ai.service.js';

/**
 * POST /simulaciones y /api/simulaciones
 * Controlador para ejecutar la simulación de los 3 esquemas PAES
 */
export const runSimulation = async (req, res, next) => {
  try {
    const { scores, careerInterest, universityInterest, includeAI = false } = req.body;

    if (!careerInterest) {
      return res.status(400).json({
        success: false,
        message: 'El campo "careerInterest" (carrera de interés) es obligatorio.',
      });
    }

    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'El objeto "scores" con los puntajes (nem, ranking, lenguaje/c_lectora, mat1/m1, etc.) es obligatorio.',
      });
    }

    // Normalizar nombres de claves de puntajes si vienen en formato snake_case o mayúsculas
    const normalizedScores = {
      nem: scores.nem !== undefined ? scores.nem : scores.NEM,
      ranking: scores.ranking,
      lenguaje: scores.lenguaje !== undefined ? scores.lenguaje : scores.c_lectora,
      mat1: scores.mat1 !== undefined ? scores.mat1 : scores.M1,
      mat2: scores.mat2 !== undefined ? scores.mat2 : scores.M2 || 0,
      cienciasHistoria: scores.cienciasHistoria !== undefined
        ? scores.cienciasHistoria
        : Math.max(scores.ciencias || 0, scores.historia || 0),
    };

    // Ejecutar lógica de los 3 esquemas
    const simulationResults = await executeSimulation({
      scores: normalizedScores,
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
 * POST /simulaciones/ia-resumen y /api/simulaciones/ia-resumen
 * Controlador específico para obtener el resumen de IA dado un cálculo de simulación
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

export default { runSimulation, getAISummary };
