import { Score, Application } from '../models/index.js';

export const createScore = async (req, res, next) => {
  try {
    const {
      application_id,
      NEM,
      ranking,
      M1,
      M2 = 0,
      c_lectora,
      ciencias = 0,
      historia = 0
    } = req.body;

    if (!application_id) {
      return res.status(400).json({
        success: false,
        error: 'application_id es obligatorio.'
      });
    }

    if (
      NEM === undefined ||
      ranking === undefined ||
      M1 === undefined ||
      c_lectora === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Debe ingresar NEM, ranking, M1 y c_lectora.'
      });
    }

    // Verificar que la aplicación existe
    const application = await Application.findByPk(application_id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'La postulación no existe.'
      });
    }

    const score = await Score.create({
      application_id: Number(application_id),
      NEM: Number(NEM),
      ranking: Number(ranking),
      M1: Number(M1),
      M2: Number(M2),
      c_lectora: Number(c_lectora),
      ciencias: Number(ciencias),
      historia: Number(historia),
      date: new Date()
    });

    return res.status(201).json(score);

  } catch (error) {
    next(error);
  }
};

export default {
  createScore
};