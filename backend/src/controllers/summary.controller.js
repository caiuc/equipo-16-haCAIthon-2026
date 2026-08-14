import {
  Summary,
  Application
} from '../models/index.js';

export const createSummary = async (req, res, next) => {
  try {
    const {
      application_id,
      good_case,
      medium_case,
      bad_case
    } = req.body;

    // Validación
    if (!application_id) {
      return res.status(400).json({
        success: false,
        error: 'application_id es obligatorio.'
      });
    }

    // Verificar que la application existe
    const application = await Application.findByPk(application_id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'La postulación no existe.'
      });
    }

    // Crear summary
    const summary = await Summary.create({
      application_id: Number(application_id),
      good_case: good_case || null,
      medium_case: medium_case || null,
      bad_case: bad_case || null
    });

    return res.status(201).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error creando summary:', error);
    next(error);
  }
};