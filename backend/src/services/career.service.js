import { Career, Major, University, Requirement } from '../models/index.js';
import { Op } from 'sequelize';
import { loadCSVData } from '../utils/csvLoader.js';

/**
 * Normaliza y construye la lista completa de carreras combinando majors, universities y requirements más recientes
 */
const buildCareersFromCSV = () => {
  const { majors, universities, requirements } = loadCSVData();
  const uniMap = new Map(universities.map((u) => [u.uni_id, u.name]));

  // Agrupar requirements por major_id y tomar el año más reciente (2026 o el mayor disponible)
  const reqMap = new Map();
  for (const req of requirements) {
    const existing = reqMap.get(req.major_id);
    if (!existing || req.year > existing.year) {
      reqMap.set(req.major_id, req);
    }
  }

  return majors.map((m) => {
    const uniName = uniMap.get(m.uni_id) || 'Universidad';
    const req = reqMap.get(m.major_id) || {
      corte: 600,
      puntajes: { NEM: 10, ranking: 20, c_lectora: 20, M1: 30, M2: 10, ciencias: 10, historia: 0 },
    };
    const p = req.puntajes || {};

    return {
      id: m.major_id,
      code: `${m.uni_id}${m.major_id.toString().padStart(3, '0')}`,
      name: m.name,
      university: uniName,
      location: uniName.includes('Valparaíso') ? 'Valparaíso' : uniName.includes('Concepción') ? 'Concepción' : 'Santiago',
      cutoffScore: req.corte || 600,
      pctNem: p.NEM || p.nem || 10,
      pctRanking: p.ranking || 20,
      pctLenguaje: p.c_lectora || p.lenguaje || 20,
      pctMat1: p.M1 || p.mat1 || 30,
      pctMat2: p.M2 || p.mat2 || 0,
      pctCienciasHistoria: Math.max(p.ciencias || 0, p.historia || 0) || (p.ciencias || p.historia || 0),
    };
  });
};

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
  } catch {
    // Si la BD aún no está disponible, usamos dataset CSV
  }

  const all = buildCareersFromCSV();
  return all.filter((c) => {
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
  } catch {
    // Si la BD aún no está disponible, usamos dataset CSV
  }

  return buildCareersFromCSV();
};
