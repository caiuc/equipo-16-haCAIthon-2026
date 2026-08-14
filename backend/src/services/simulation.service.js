import { findCareers, getAllCareers } from './career.service.js';

/**
 * Calcula el puntaje ponderado de un postulante según los porcentajes de una carrera
 * @param {object} scores Puntajes del postulante (nem, ranking, lenguaje, mat1, mat2, cienciasHistoria)
 * @param {object} weights Ponderaciones de la carrera (pctNem, pctRanking, etc.)
 * @returns {number}
 */
export const calculateWeightedScore = (scores, weights) => {
  const nem = Number(scores.nem) || 0;
  const ranking = Number(scores.ranking) || 0;
  const lenguaje = Number(scores.lenguaje) || 0;
  const mat1 = Number(scores.mat1) || 0;
  const mat2 = Number(scores.mat2) || 0;
  const cienciasHistoria = Number(scores.cienciasHistoria) || 0;

  const total =
    nem * (weights.pctNem / 100) +
    ranking * (weights.pctRanking / 100) +
    lenguaje * (weights.pctLenguaje / 100) +
    mat1 * (weights.pctMat1 / 100) +
    mat2 * (weights.pctMat2 / 100) +
    cienciasHistoria * (weights.pctCienciasHistoria / 100);

  return Math.round(total * 10) / 10;
};

/**
 * ESQUEMA 1: Puntos faltantes y brecha por sección
 * Calcula la diferencia con el corte y cuántos puntos en cada prueba necesitaría subir para alcanzarlo.
 */
export const calculateGapAnalysis = (scores, career) => {
  const userWeighted = calculateWeightedScore(scores, career);
  const gap = Math.max(0, Math.round((career.cutoffScore - userWeighted) * 10) / 10);
  const meetsCutoff = userWeighted >= career.cutoffScore;

  // Cálculo de puntos brutos adicionales necesarios por cada prueba si solo subiera esa prueba
  const pointsNeededBySection = {};
  const testSections = [
    { key: 'lenguaje', name: 'Comprensión Lectora', weight: career.pctLenguaje, current: scores.lenguaje },
    { key: 'mat1', name: 'Matemática 1 (M1)', weight: career.pctMat1, current: scores.mat1 },
    { key: 'mat2', name: 'Matemática 2 (M2)', weight: career.pctMat2, current: scores.mat2 },
    { key: 'cienciasHistoria', name: 'Ciencias / Historia', weight: career.pctCienciasHistoria, current: scores.cienciasHistoria },
  ];

  for (const test of testSections) {
    if (test.weight > 0 && gap > 0) {
      // delta_ponderado = delta_bruto * (weight / 100) => delta_bruto = gap / (weight / 100)
      const rawPointsNeeded = Math.ceil(gap / (test.weight / 100));
      const targetScore = Math.min(1000, Number(test.current || 0) + rawPointsNeeded);
      const isPossible = Number(test.current || 0) + rawPointsNeeded <= 1000;

      pointsNeededBySection[test.key] = {
        sectionName: test.name,
        weightPercentage: test.weight,
        currentScore: test.current,
        rawPointsNeeded,
        targetScore,
        isAchievable: isPossible,
      };
    }
  }

  return {
    careerId: career.id,
    careerName: career.name,
    university: career.university,
    cutoffScore: career.cutoffScore,
    userWeightedScore: userWeighted,
    meetsCutoff,
    pointsGap: gap,
    requirementsBySection: pointsNeededBySection,
  };
};

/**
 * ESQUEMA 2: Dónde puede postular actualmente
 * Lista todas las opciones donde el puntaje ponderado alcanza o supera el corte.
 */
export const calculateEligibleCareers = (scores, careerList) => {
  return careerList
    .map((career) => {
      const userWeighted = calculateWeightedScore(scores, career);
      const margin = Math.round((userWeighted - career.cutoffScore) * 10) / 10;
      return {
        careerId: career.id,
        careerName: career.name,
        university: career.university,
        location: career.location,
        cutoffScore: career.cutoffScore,
        userWeightedScore: userWeighted,
        isEligible: userWeighted >= career.cutoffScore,
        marginScore: margin, // Positivo si sobra puntaje, negativo si falta
      };
    })
    .filter((item) => item.isEligible)
    .sort((a, b) => b.marginScore - a.marginScore);
};

/**
 * ESQUEMA 3: Escenario a la baja
 * Simula qué ocurre si los puntajes del estudiante bajan (ej. un 5% o -30 puntos por prueba de ensayo)
 */
export const calculateDropScenario = (scores, careerList, dropPercent = 5) => {
  const factor = (100 - dropPercent) / 100;
  const droppedScores = {
    nem: scores.nem, // NEM y Ranking suelen ser fijos
    ranking: scores.ranking,
    lenguaje: Math.round((scores.lenguaje || 0) * factor),
    mat1: Math.round((scores.mat1 || 0) * factor),
    mat2: Math.round((scores.mat2 || 0) * factor),
    cienciasHistoria: Math.round((scores.cienciasHistoria || 0) * factor),
  };

  const results = careerList.map((career) => {
    const normalWeighted = calculateWeightedScore(scores, career);
    const droppedWeighted = calculateWeightedScore(droppedScores, career);
    const wasEligible = normalWeighted >= career.cutoffScore;
    const stillEligible = droppedWeighted >= career.cutoffScore;

    return {
      careerId: career.id,
      careerName: career.name,
      university: career.university,
      cutoffScore: career.cutoffScore,
      originalWeightedScore: normalWeighted,
      droppedWeightedScore: droppedWeighted,
      scoreLoss: Math.round((normalWeighted - droppedWeighted) * 10) / 10,
      wasEligible,
      stillEligible,
      status: stillEligible ? 'SEGURO' : wasEligible ? 'EN_RIESGO' : 'FUERA_DE_CORTE',
    };
  });

  return {
    dropSimulationFactor: `${dropPercent}% menos en pruebas`,
    simulatedScores: droppedScores,
    results,
  };
};

/**
 * Ejecuta la simulación completa reuniendo los 3 esquemas
 */
export const executeSimulation = async (inputData) => {
  const { scores, careerInterest, universityInterest } = inputData;

  // Obtener carreras que coinciden con el interés o todas
  const matchingCareers = await findCareers({
    careerName: careerInterest,
    university: universityInterest,
  });

  const allCareers = await getAllCareers();

  // 1. Esquema 1: Brecha con la carrera principal de interés (o primera coincidencia)
  const targetCareer = matchingCareers[0] || allCareers[0];
  const scheme1 = targetCareer ? calculateGapAnalysis(scores, targetCareer) : null;

  // 2. Esquema 2: Carreras elegibles con el puntaje actual
  const scheme2 = calculateEligibleCareers(scores, allCareers);

  // 3. Esquema 3: Simulación en caso de baja de puntaje (ej: 5%)
  const scheme3 = calculateDropScenario(scores, allCareers, 5);

  return {
    userScores: scores,
    targetCareer: targetCareer ? { name: targetCareer.name, university: targetCareer.university } : null,
    esquema1_brechaPuntajes: scheme1,
    esquema2_carrerasElegibles: scheme2,
    esquema3_escenarioBaja: scheme3,
  };
};
