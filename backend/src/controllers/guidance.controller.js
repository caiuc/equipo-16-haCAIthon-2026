import {
  Major,
  University,
  Requirement
} from '../models/index.js';

import { Op } from 'sequelize';
import { generateEducationalSummary } from '../services/ai.service.js';


// ======================================================
// POST /career-guidance
// ======================================================

export const getCareerGuidance = async (req, res, next) => {
  try {
    const {
      NEM,
      ranking,
      M1,
      M2,
      c_lectora,
      ciencias,
      historia,
      carrera,
      universidad
    } = req.body;


    // ==================================================
    // 1. Puntajes recibidos
    // ==================================================

    const scores = {
      NEM: NEM ?? null,
      ranking: ranking ?? null,
      M1: M1 ?? null,
      M2: M2 ?? null,
      c_lectora: c_lectora ?? null,
      ciencias: ciencias ?? null,
      historia: historia ?? null
    };


    // ==================================================
    // 2. Buscar universidad si fue especificada
    // ==================================================

    let university = null;

    if (universidad) {
      university = await University.findOne({
        where: {
          name: {
            [Op.iLike]: `%${universidad}%`
          }
        }
      });

      if (!university) {
        return res.status(404).json({
          success: false,
          error: `No se encontró la universidad: ${universidad}`
        });
      }
    }


    // ==================================================
    // 3. Buscar carreras
    // ==================================================

    const majorWhere = {};

    if (university) {
      majorWhere.uni_id = university.uni_id;
    }

    if (carrera) {
      majorWhere.name = {
        [Op.iLike]: `%${carrera}%`
      };
    }


    const majors = await Major.findAll({
      where: majorWhere,

      include: [
        {
          model: University,
          as: 'university'
        },
        {
          model: Requirement,
          as: 'requirements'
        }
      ]
    });


    // ==================================================
    // 4. Si no encontramos carreras
    // ==================================================

    if (majors.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron carreras con los filtros indicados.'
      });
    }


    // ==================================================
    // 5. Evaluar cada carrera
    // ==================================================

    const candidates = [];

    for (const major of majors) {

      const requirements = [
        ...(major.requirements || [])
      ].sort(
        (a, b) =>
          Number(b.year) - Number(a.year)
      );


      if (requirements.length === 0) {
        continue;
      }


      // Usamos el requirement más reciente
      const requirement = requirements[0];


      let weights = requirement.puntajes;


      if (typeof weights === 'string') {
        try {
          weights = JSON.parse(weights);
        } catch {
          continue;
        }
      }


      if (!weights) {
        continue;
      }


      // ================================================
      // Ver qué pruebas necesita realmente la carrera
      // ================================================

      const requiredTests = Object.entries(weights)
        .filter(([_, weight]) => Number(weight) > 0)
        .map(([test]) => test);


      // ================================================
      // Ver qué pruebas tiene el estudiante
      // ================================================

      const missingTests = requiredTests.filter(
        test => scores[test] === null ||
                scores[test] === undefined
      );


      // ================================================
      // Calcular ponderado solamente si tenemos
      // todas las pruebas necesarias
      // ================================================

      let weightedScore = null;

      if (missingTests.length === 0) {

        weightedScore =
          Object.entries(weights)
            .reduce((total, [test, weight]) => {

              const studentScore =
                Number(scores[test] || 0);

              return total +
                studentScore *
                (Number(weight) / 100);

            }, 0);

        weightedScore =
          Math.round(weightedScore * 100) / 100;
      }


      // ================================================
      // Diferencia contra corte
      // ================================================

      let difference = null;

      if (weightedScore !== null) {
        difference =
          Math.round(
            (weightedScore -
              Number(requirement.corte || 0)) *
              100
          ) / 100;
      }


      // ================================================
      // Clasificación
      // ================================================

      let status;

      if (weightedScore === null) {

        status = 'FALTAN_PUNTAJES';

      } else if (difference >= 30) {

        status = 'MUY_FAVORABLE';

      } else if (difference >= 0) {

        status = 'FAVORABLE';

      } else if (difference >= -30) {

        status = 'EN_RIESGO';

      } else {

        status = 'DIFICIL';
      }


      candidates.push({

        major_id: major.major_id,

        major_name: major.name,

        university_id:
          major.university?.uni_id,

        university_name:
          major.university?.name,

        requirement_year:
          requirement.year,

        cutoff:
          Number(requirement.corte),

        weights,

        required_tests: requiredTests,

        missing_tests: missingTests,

        weighted_score: weightedScore,

        difference,

        status

      });
    }


    // ==================================================
    // 6. Ordenar candidatos
    // ==================================================

    candidates.sort((a, b) => {

      // Los que podemos calcular primero
      if (
        a.weighted_score !== null &&
        b.weighted_score === null
      ) {
        return -1;
      }

      if (
        a.weighted_score === null &&
        b.weighted_score !== null
      ) {
        return 1;
      }

      // Después por diferencia
      return (
        (b.difference ?? -9999) -
        (a.difference ?? -9999)
      );
    });


    // ==================================================
    // 7. Mandar solamente los mejores candidatos a IA
    // ==================================================

    const candidatesForAI =
      candidates.slice(0, 20);


    // ==================================================
    // 8. Construir información para Gemini
    // ==================================================

    const guidanceData = {

      student_scores: scores,

      preferences: {
        carrera: carrera || null,
        universidad: universidad || null
      },

      candidates: candidatesForAI.map(candidate => ({
        major_name: candidate.major_name,
        university_name: candidate.university_name,

        cutoff: candidate.cutoff,

        weighted_score:
          candidate.weighted_score,

        difference:
          candidate.difference,

        status:
          candidate.status,

        missing_tests:
          candidate.missing_tests
      }))
    };


    // ==================================================
    // 9. Pedir consejo a IA
    // ==================================================

    const aiSummary =
      await generateEducationalSummary(
        guidanceData
      );


    // ==================================================
    // 10. Respuesta
    // ==================================================

    return res.status(200).json({

      success: true,

      student_scores: scores,

      preferences: {
        carrera: carrera || null,
        universidad: universidad || null
      },

      candidates: candidatesForAI,

      ai_summary: aiSummary

    });

  } catch (error) {

    console.error(
      'Error en career guidance:',
      error
    );

    next(error);
  }
};


export default {
  getCareerGuidance
};