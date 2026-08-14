import {
  executeSimulation,
  calculateThreeTiersRecommendation,
} from '../services/simulation.service.js';
import { generateEducationalSummary } from '../services/ai.service.js';

/**
 * POST / GET /simulaciones/recomendaciones
 * Endpoint para obtener las 3 categorías de universidades/carreras filtradas:
 * 1. Aspiracional (meta si sube puntajes)
 * 2. Mejor opción actual (corte más alto alcanzable)
 * 3. Opciones de respaldo (todas las demás con menor corte que la 2da)
 */
export const getThreeTiersRecommendations = async (req, res, next) => {
  try {
    const data = req.method === 'GET' ? req.query : (req.body || {});
    const { scores, careerInterest, carrera, universityInterest, universidad } = data;

    const career = careerInterest || carrera || req.query.carrera || req.query.careerInterest || 'Ingeniería Civil';
    const uni = universityInterest || universidad || req.query.universidad || req.query.universityInterest;

    let userScores = scores;
    if (!userScores && req.method === 'GET') {
      userScores = {
        nem: req.query.nem || req.query.NEM || 750,
        ranking: req.query.ranking || 770,
        lenguaje: req.query.lenguaje || req.query.c_lectora || 700,
        mat1: req.query.mat1 || req.query.M1 || 820,
        mat2: req.query.mat2 || req.query.M2 || 700,
        ciencias: req.query.ciencias || 680,
        historia: req.query.historia || 650,
      };
    }

    if (!userScores || typeof userScores !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'El objeto "scores" con los puntajes (NEM, ranking, M1, etc.) es obligatorio.',
      });
    }

    const normalizedScores = {
      nem: Number(userScores.nem !== undefined ? userScores.nem : userScores.NEM) || 750,
      ranking: Number(userScores.ranking) || 750,
      lenguaje: Number(userScores.lenguaje !== undefined ? userScores.lenguaje : userScores.c_lectora) || 700,
      mat1: Number(userScores.mat1 !== undefined ? userScores.mat1 : userScores.M1) || 750,
      mat2: Number(userScores.mat2 !== undefined ? userScores.mat2 : userScores.M2) || 0,
      cienciasHistoria: userScores.cienciasHistoria !== undefined
        ? Number(userScores.cienciasHistoria)
        : Math.max(Number(userScores.ciencias || 0), Number(userScores.historia || 0)),
    };

    const recommendations = await calculateThreeTiersRecommendation({
      scores: normalizedScores,
      careerInterest: career,
      universityInterest: uni,
    });

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /simulaciones y /api/simulaciones
 * Controlador para ejecutar la simulación de los 3 esquemas PAES
 */
export const runSimulation = async (req, res, next) => {
  try {
    const { scores, careerInterest, universityInterest, includeAI = false } = req.body || {};

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
    const { simulationData } = req.body || {};

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

export default {
  getThreeTiersRecommendations,
  runSimulation,
  getAISummary,
};
