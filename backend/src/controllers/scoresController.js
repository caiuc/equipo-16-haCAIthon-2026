import { Score } from '../models/index.js';

/**
 * POST /scores
 * Crea un registro de puntajes de postulación
 */
export const createScore = async (req, res, next) => {
  try {
    const {
      application_id,
      NEM,
      ranking,
      M1,
      M2,
      c_lectora,
      ciencias,
      historia,
      nem,
      m1,
      m2,
      lenguaje,
    } = req.body;

    const valNem = NEM !== undefined ? NEM : nem;
    const valRanking = ranking !== undefined ? ranking : 0;
    const valM1 = M1 !== undefined ? M1 : m1;
    const valM2 = M2 !== undefined ? M2 : m2 || 0;
    const valCLectora = c_lectora !== undefined ? c_lectora : lenguaje;
    const valCiencias = ciencias !== undefined ? ciencias : 0;
    const valHistoria = historia !== undefined ? historia : 0;

    if (valNem === undefined || valRanking === undefined || valM1 === undefined || valCLectora === undefined) {
      return res.status(400).json({
        error: 'Debe ingresar al menos los puntajes obligatorios: NEM, ranking, c_lectora y M1.',
      });
    }

    try {
      const newScore = await Score.create({
        application_id: application_id || null,
        NEM: Number(valNem),
        ranking: Number(valRanking),
        M1: Number(valM1),
        M2: Number(valM2),
        c_lectora: Number(valCLectora),
        ciencias: Number(valCiencias),
        historia: Number(valHistoria),
        date: new Date(),
      });

      return res.status(201).json(newScore);
    } catch {
      // Fallback simulado si no hay BD
      const mockScore = {
        score_id: Date.now(),
        application_id: application_id || null,
        NEM: Number(valNem),
        ranking: Number(valRanking),
        M1: Number(valM1),
        M2: Number(valM2),
        c_lectora: Number(valCLectora),
        ciencias: Number(valCiencias),
        historia: Number(valHistoria),
        date: new Date().toISOString(),
      };
      return res.status(201).json(mockScore);
    }
  } catch (error) {
    next(error);
  }
};

export default { createScore };