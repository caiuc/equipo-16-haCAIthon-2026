import { findCareers, getAllCareers } from '../services/career.service.js';

/**
 * GET /carreras y /api/carreras
 * Controlador para listar carreras y universidades con filtros opcionales
 */
export const getCareers = async (req, res, next) => {
  try {
    const { carrera, universidad } = req.query;

    let results;
    if (carrera || universidad) {
      results = await findCareers({
        careerName: carrera,
        university: universidad,
      });
    } else {
      results = await getAllCareers();
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export default { getCareers };
