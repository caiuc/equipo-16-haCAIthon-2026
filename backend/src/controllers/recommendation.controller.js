import {
  Major,
  CareerType,
  MajorCareerType,
  Requirement,
  University
} from '../models/index.js';

import { Op } from 'sequelize';


// ======================================================
// GET /career-recommendations
// ======================================================

export const getCareerRecommendations = async (req, res, next) => {

  try {

    // ==================================================
    // 1. Obtener JSON
    // ==================================================

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
    // 2. Validaciones
    // ==================================================

    if (!carrera) {
      return res.status(400).json({
        success: false,
        error: 'Debes indicar una carrera.'
      });
    }

    if (!universidad) {
      return res.status(400).json({
        success: false,
        error: 'Debes indicar una universidad.'
      });
    }


    // ==================================================
    // 3. Puntajes entregados
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
    // 4. Buscar carrera objetivo
    // ==================================================

    const targetMajors = await Major.findAll({

      where: {
        name: {
          [Op.iLike]: `%${carrera}%`
        }
      },

      include: [

        {
          model: University,
          as: 'university',

          where: {
            name: {
              [Op.iLike]: `%${universidad}%`
            }
          }
        },

        {
          model: CareerType,
          as: 'careerTypes',

          through: {
            attributes: []
          }
        }
      ]
    });


    if (targetMajors.length === 0) {

      return res.status(404).json({
        success: false,
        error: `No se encontró una carrera "${carrera}" en "${universidad}".`
      });

    }


    // ==================================================
    // 5. Obtener Career Types de la carrera objetivo
    // ==================================================

    const careerTypeIds = [
      ...new Set(
        targetMajors.flatMap(
          major =>
            (major.careerTypes || [])
              .map(ct => Number(ct.career_type_id))
        )
      )
    ];


    if (careerTypeIds.length === 0) {

      return res.status(404).json({
        success: false,
        error:
          'La carrera seleccionada no tiene career types asociados.'
      });

    }


    // ==================================================
    // 6. Buscar carreras relacionadas
    // ==================================================

    const relatedRelations =
      await MajorCareerType.findAll({

        where: {
          career_type_id: {
            [Op.in]: careerTypeIds
          }
        }

      });


    const relatedMajorIds = [
      ...new Set(
        relatedRelations.map(
          relation => Number(relation.major_id)
        )
      )
    ];


    // ==================================================
    // 7. Obtener Majors relacionados
    // ==================================================

    const majors = await Major.findAll({

      where: {
        major_id: {
          [Op.in]: relatedMajorIds
        }
      },

      include: [

        {
          model: University,
          as: 'university',

          attributes: [
            'uni_id',
            'name'
          ]
        },

        {
          model: Requirement,
          as: 'requirements'
        },

        {
          model: CareerType,
          as: 'careerTypes',

          through: {
            attributes: []
          }
        }

      ]
    });


    // ==================================================
    // 8. Calcular ponderado de cada carrera
    // ==================================================

    const candidates = [];


    for (const major of majors) {

      // ----------------------------------------------
      // Requirement más reciente
      // ----------------------------------------------

      const requirements =
        [...(major.requirements || [])]
          .sort(
            (a, b) =>
              Number(b.year) - Number(a.year)
          );


      if (requirements.length === 0) {
        continue;
      }


      const requirement =
        requirements[0];


      // ----------------------------------------------
      // Ponderaciones
      // ----------------------------------------------

      let weights =
        requirement.puntajes;


      if (typeof weights === 'string') {

        try {

          weights =
            JSON.parse(weights);

        } catch {

          continue;

        }

      }


      if (!weights || typeof weights !== 'object') {
        continue;
      }


      // ----------------------------------------------
      // Verificar pruebas faltantes
      // ----------------------------------------------

      const relevantTests = [
        'NEM',
        'ranking',
        'M1',
        'M2',
        'c_lectora',
        'ciencias',
        'historia'
      ];


      const missingTests =
        relevantTests.filter(test => {

          const weight =
            Number(weights[test] || 0);

          return (
            weight > 0 &&
            (
              scores[test] === null ||
              scores[test] === undefined
            )
          );

        });


      // No podemos calcular honestamente
      // esta carrera si falta una prueba
      // que tenga ponderación.

      if (missingTests.length > 0) {
        continue;
      }


      // ----------------------------------------------
      // Calcular ponderado
      // ----------------------------------------------

      let weightedScore = 0;


      for (const test of relevantTests) {

        const studentScore =
          Number(scores[test] || 0);

        const weight =
          Number(weights[test] || 0) / 100;

        weightedScore +=
          studentScore * weight;

      }


      weightedScore =
        Math.round(weightedScore * 100) / 100;


      // ----------------------------------------------
      // Corte
      // ----------------------------------------------

      const cutoff =
        Number(requirement.corte);


      if (Number.isNaN(cutoff)) {
        continue;
      }


      const difference =
        Math.round(
          (weightedScore - cutoff) * 100
        ) / 100;


      // ----------------------------------------------
      // Guardar candidato
      // ----------------------------------------------

      candidates.push({

        major_id:
          major.major_id,

        major_name:
          major.name,

        university: {
          uni_id:
            major.university?.uni_id,

          name:
            major.university?.name
        },

        career_types:
          (major.careerTypes || []).map(ct => ({
            career_type_id:
              ct.career_type_id,

            name:
              ct.name
          })),

        requirement_year:
          requirement.year,

        weighted_score:
          weightedScore,

        cutoff,

        difference,

        missing_tests:
          missingTests

      });

    }


    // ==================================================
    // 9. No hay candidatos
    // ==================================================

    if (candidates.length === 0) {

      return res.status(422).json({

        success: false,

        error:
          'No fue posible calcular carreras con los puntajes entregados. Puede que falten pruebas necesarias.'

      });

    }


    // ==================================================
    // 10. CARRERA MÁS ALTA ALCANZABLE
    // ==================================================

    const reachable =
      candidates
        .filter(
          candidate =>
            candidate.difference >= 0
        )
        .sort(
          (a, b) =>
            b.cutoff - a.cutoff
        );


    const highestReachable =
      reachable[0] || null;


    // ==================================================
    // 11. CARRERA MÁS ADECUADA
    //
    // Buscamos aproximadamente
    // 15-30 puntos sobre el corte.
    // ==================================================

    let bestFit = null;


    const safeCandidates =
      candidates.filter(
        candidate =>
          candidate.difference >= 15
      );


    if (safeCandidates.length > 0) {

      bestFit =
        safeCandidates.reduce(
          (best, candidate) => {

            if (!best) {
              return candidate;
            }


            const bestDistance =
              Math.abs(
                best.difference - 25
              );


            const candidateDistance =
              Math.abs(
                candidate.difference - 25
              );


            return candidateDistance <
              bestDistance
              ? candidate
              : best;

          },
          null
        );

    }


    // Si no hay una carrera con +15,
    // usamos la más alcanzable.

    if (!bestFit) {
      bestFit = highestReachable;
    }


    // ==================================================
    // 12. CARRERA SEGURA / MÁS BAJA
    //
    // Queremos una con bastante margen.
    // ==================================================

    const fallbackCandidates =
      candidates
        .filter(
          candidate =>
            candidate.difference >= 40
        )
        .sort(
          (a, b) =>
            a.cutoff - b.cutoff
        );


    const fallback =
      fallbackCandidates[0] || null;


    // ==================================================
    // 13. Respuesta
    // ==================================================

    return res.status(200).json({

      success: true,

      target: {

        carrera,

        universidad,

        career_types:
          careerTypeIds

      },

      student_scores:
        scores,

      recommendations: {

        highest_reachable:
          highestReachable,

        best_fit:
          bestFit,

        fallback:
          fallback

      }

    });


  } catch (error) {

    console.error(
      'Error en career recommendations:',
      error
    );

    next(error);

  }

};


export default {
  getCareerRecommendations
};