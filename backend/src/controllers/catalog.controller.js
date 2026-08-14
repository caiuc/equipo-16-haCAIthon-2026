import { University, CareerType, Major, Requirement } from '../models/index.js';
import { loadCSVData } from '../utils/csvLoader.js';

/**
 * GET /universities
 * Retorna la lista de todas las universidades disponibles
 */
export const getUniversities = async (req, res, next) => {
  try {
    try {
      const dbUnis = await University.findAll({
        attributes: ['uni_id', 'name'],
        order: [['uni_id', 'ASC']],
      });
      if (dbUnis && dbUnis.length > 0) {
        return res.status(200).json(dbUnis);
      }
    } catch {
      // Fallback a CSV si la BD no está disponible
    }

    const { universities } = loadCSVData();
    return res.status(200).json(universities);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /career_types
 * Retorna las categorías o grupos de afinidad
 */
export const getCareerTypes = async (req, res, next) => {
  try {
    try {
      const dbTypes = await CareerType.findAll({
        attributes: ['career_type_id', 'name'],
        order: [['career_type_id', 'ASC']],
      });
      if (dbTypes && dbTypes.length > 0) {
        return res.status(200).json(dbTypes);
      }
    } catch {
      // Fallback a CSV
    }

    const { careerTypes } = loadCSVData();
    return res.status(200).json(careerTypes);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /majors
 * Retorna el listado de todas las carreras con los datos de su universidad asociada
 */
export const getMajors = async (req, res, next) => {
  try {
    const { carrera, universidad } = req.query;

    try {
      const dbMajors = await Major.findAll({
        attributes: ['major_id', 'name', 'uni_id'],
        include: [
          {
            model: University,
            as: 'university',
            attributes: ['uni_id', 'name'],
          },
        ],
        order: [['major_id', 'ASC']],
      });

      if (dbMajors && dbMajors.length > 0) {
        let results = dbMajors.map((m) => ({
          major_id: m.major_id,
          name: m.name,
          university: m.university
            ? { uni_id: m.university.uni_id, name: m.university.name }
            : { uni_id: m.uni_id, name: '' },
        }));

        if (carrera) {
          results = results.filter((m) =>
            m.name.toLowerCase().includes(carrera.toLowerCase())
          );
        }
        if (universidad) {
          results = results.filter((m) =>
            m.university.name.toLowerCase().includes(universidad.toLowerCase())
          );
        }

        return res.status(200).json(results);
      }
    } catch {
      // Fallback a CSV
    }

    const { majors, universities } = loadCSVData();
    const uniMap = new Map(universities.map((u) => [u.uni_id, u.name]));

    let results = majors.map((m) => ({
      major_id: m.major_id,
      name: m.name,
      university: {
        uni_id: m.uni_id,
        name: uniMap.get(m.uni_id) || 'Universidad de Chile',
      },
    }));

    if (carrera) {
      results = results.filter((m) =>
        m.name.toLowerCase().includes(carrera.toLowerCase())
      );
    }
    if (universidad) {
      results = results.filter((m) =>
        m.university.name.toLowerCase().includes(universidad.toLowerCase())
      );
    }

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /majors/:major_id/requirements
 * Retorna los requisitos (ponderaciones y cortes) de los últimos años para una carrera específica
 */
export const getMajorRequirements = async (req, res, next) => {
  try {
    const majorId = Number(req.params.major_id);

    if (!majorId || isNaN(majorId)) {
      return res.status(400).json({ error: 'El ID de la carrera debe ser un número válido.' });
    }

    try {
      const dbRequirements = await Requirement.findAll({
        where: { major_id: majorId },
        order: [['year', 'DESC']],
      });

      if (dbRequirements && dbRequirements.length > 0) {
        const formatted = dbRequirements.map((r) => ({
          requirement_id: r.requirement_id,
          year: r.year,
          corte: r.corte,
          puntajes: r.puntajes,
        }));
        return res.status(200).json(formatted);
      }
    } catch {
      // Fallback a CSV
    }

    const { requirements } = loadCSVData();
    const filtered = requirements
      .filter((r) => r.major_id === majorId)
      .sort((a, b) => b.year - a.year);

    if (filtered.length === 0) {
      return res.status(404).json({ error: 'No se encontraron requisitos para esta carrera' });
    }

    return res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
};
