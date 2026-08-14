import { Career } from '../models/career.model.js';
import { Op } from 'sequelize';

// Datos de respaldo / iniciales para que el sistema funcione de inmediato incluso antes de poblar la BD
const SAMPLE_CAREERS = [
  {
    id: 1,
    code: '11045',
    name: 'Ingeniería Civil',
    university: 'Pontificia Universidad Católica de Chile',
    location: 'Santiago',
    cutoffScore: 895.5,
    pctNem: 20,
    pctRanking: 25,
    pctLenguaje: 10,
    pctMat1: 30,
    pctMat2: 10,
    pctCienciasHistoria: 5,
  },
  {
    id: 2,
    code: '12045',
    name: 'Ingeniería Civil',
    university: 'Universidad de Chile',
    location: 'Santiago',
    cutoffScore: 882.3,
    pctNem: 15,
    pctRanking: 25,
    pctLenguaje: 15,
    pctMat1: 30,
    pctMat2: 10,
    pctCienciasHistoria: 5,
  },
  {
    id: 3,
    code: '13020',
    name: 'Ingeniería Civil',
    university: 'Universidad Técnica Federico Santa María',
    location: 'Valparaíso',
    cutoffScore: 840.0,
    pctNem: 15,
    pctRanking: 20,
    pctLenguaje: 10,
    pctMat1: 35,
    pctMat2: 15,
    pctCienciasHistoria: 5,
  },
  {
    id: 4,
    code: '11030',
    name: 'Medicina',
    university: 'Pontificia Universidad Católica de Chile',
    location: 'Santiago',
    cutoffScore: 940.2,
    pctNem: 20,
    pctRanking: 20,
    pctLenguaje: 15,
    pctMat1: 20,
    pctMat2: 0,
    pctCienciasHistoria: 25,
  },
  {
    id: 5,
    code: '12030',
    name: 'Medicina',
    university: 'Universidad de Chile',
    location: 'Santiago',
    cutoffScore: 935.8,
    pctNem: 20,
    pctRanking: 20,
    pctLenguaje: 15,
    pctMat1: 20,
    pctMat2: 0,
    pctCienciasHistoria: 25,
  },
  {
    id: 6,
    code: '11060',
    name: 'Derecho',
    university: 'Pontificia Universidad Católica de Chile',
    location: 'Santiago',
    cutoffScore: 810.0,
    pctNem: 20,
    pctRanking: 20,
    pctLenguaje: 35,
    pctMat1: 15,
    pctMat2: 0,
    pctCienciasHistoria: 10,
  },
];

/**
 * Obtener lista de carreras filtrada por nombre y/o universidad
 */
export const findCareers = async ({ careerName, university }) => {
  try {
    const where = {};
    if (careerName) {
      where.name = { [Op.iLike]: `%${careerName}%` };
    }
    if (university) {
      where.university = { [Op.iLike]: `%${university}%` };
    }

    const dbResults = await Career.findAll({ where });
    if (dbResults && dbResults.length > 0) {
      return dbResults.map((c) => c.toJSON());
    }
  } catch (error) {
    // Si la BD aún no está disponible o tablas vacías, usamos fallback
  }

  // Filtrado sobre datos locales de muestra
  return SAMPLE_CAREERS.filter((c) => {
    const matchesCareer = !careerName || c.name.toLowerCase().includes(careerName.toLowerCase());
    const matchesUni = !university || c.university.toLowerCase().includes(university.toLowerCase());
    return matchesCareer && matchesUni;
  });
};

/**
 * Obtener todas las carreras disponibles
 */
export const getAllCareers = async () => {
  try {
    const dbResults = await Career.findAll();
    if (dbResults && dbResults.length > 0) {
      return dbResults.map((c) => c.toJSON());
    }
  } catch (error) {
    // Si la BD aún no está disponible, usamos fallback
  }
  return SAMPLE_CAREERS;
};
