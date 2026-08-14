import {
  Application,
  Score,
  Major,
  Requirement,
  MajorCareerType,
  University,
  User,
  CareerType
} from '../models/index.js';

import { Op } from 'sequelize';

/**
 * POST /applications
 *
 * Crea una postulación asociada a:
 * - usuario
 * - universidad
 * - carrera
 */
export const createApplication = async (req, res, next) => {
  try {
    const {
      user_id,
      university_id,
      major_id,
      status = 'EN_PROCESO'
    } = req.body;

    // ----------------------------------
    // Validaciones
    // ----------------------------------

    if (!user_id || !university_id || !major_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id, university_id y major_id son obligatorios.'
      });
    }

    // ----------------------------------
    // Verificar usuario
    // ----------------------------------

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'El usuario no existe.'
      });
    }

    // ----------------------------------
    // Verificar universidad
    // ----------------------------------

    const university = await University.findByPk(university_id);

    if (!university) {
      return res.status(404).json({
        success: false,
        error: 'La universidad no existe.'
      });
    }

    // ----------------------------------
    // Verificar carrera
    // ----------------------------------

    const major = await Major.findByPk(major_id);

    if (!major) {
      return res.status(404).json({
        success: false,
        error: 'La carrera no existe.'
      });
    }

    // ----------------------------------
    // Verificar consistencia
    // carrera <-> universidad
    // ----------------------------------

    if (Number(major.uni_id) !== Number(university_id)) {
      return res.status(400).json({
        success: false,
        error: 'La carrera no pertenece a la universidad seleccionada.'
      });
    }

    // ----------------------------------
    // Crear application
    // ----------------------------------

    const application = await Application.create({
      user_id: Number(user_id),
      university_id: Number(university_id),
      major_id: Number(major_id),
      status
    });

    return res.status(201).json({
      success: true,
      data: application
    });

  } catch (error) {
    next(error);
  }
};


/**
 * GET /applications/:id/admission_analysis
 *
 * Analiza una postulación:
 *
 * Application
 *      ↓
 * Score
 *      ↓
 * Major
 *   ├── University
 *   ├── Requirements
 *   └── CareerTypes
 *
 * Calcula:
 * - puntaje ponderado
 * - corte histórico más reciente
 * - diferencia
 * - estado de admisión
 * - carrera desafío
 */
export const getAdmissionAnalysis = async (req, res, next) => {
  try {
    const applicationId = Number(req.params.id);

    if (!Number.isInteger(applicationId)) {
      return res.status(400).json({
        success: false,
        error: 'El application_id debe ser un número entero.'
      });
    }

    // =========================================================
    // 1. BUSCAR APPLICATION
    // =========================================================

    const application = await Application.findByPk(applicationId, {
      include: [
        {
          model: Score,
          as: 'score'
        },
        {
          model: Major,
          as: 'major',
          include: [
            {
              model: University,
              as: 'university'
            },
            {
              model: Requirement,
              as: 'requirements'
            },
            {
              model: MajorCareerType,
              as: 'majorCareerTypes',
              include: [
                {
                  model: CareerType,
                  as: 'careerType'
                }
              ]
            }
          ]
        }
      ]
    });

    // =========================================================
    // 2. VALIDAR APPLICATION
    // =========================================================

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'La postulación no existe.'
      });
    }

    if (!application.score) {
      return res.status(404).json({
        success: false,
        error: 'La postulación todavía no tiene puntajes.'
      });
    }

    if (!application.major) {
      return res.status(404).json({
        success: false,
        error: 'La postulación no tiene una carrera asociada.'
      });
    }

    // =========================================================
    // 3. OBTENER DATOS
    // =========================================================

    const score = application.score;
    const major = application.major;

    const requirements = [...(major.requirements || [])]
      .sort((a, b) => Number(b.year) - Number(a.year));

    if (requirements.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'La carrera no tiene requisitos históricos.'
      });
    }

    // Último requirement disponible
    const latestRequirement = requirements[0];

    // =========================================================
    // 4. OBTENER PONDERACIONES
    // =========================================================

    let ponderaciones = latestRequirement.puntajes;

    if (typeof ponderaciones === 'string') {
      try {
        ponderaciones = JSON.parse(ponderaciones);
      } catch {
        return res.status(500).json({
          success: false,
          error: 'Las ponderaciones del requirement no tienen un formato JSON válido.'
        });
      }
    }

    if (!ponderaciones || typeof ponderaciones !== 'object') {
      return res.status(500).json({
        success: false,
        error: 'La carrera no tiene ponderaciones válidas.'
      });
    }

    // =========================================================
    // 5. CALCULAR PUNTAJE PONDERADO
    // =========================================================

    const puntajePonderadoBruto =
      Number(score.NEM || 0) *
        (Number(ponderaciones.NEM || 0) / 100) +

      Number(score.ranking || 0) *
        (Number(ponderaciones.ranking || 0) / 100) +

      Number(score.c_lectora || 0) *
        (Number(ponderaciones.c_lectora || 0) / 100) +

      Number(score.M1 || 0) *
        (Number(ponderaciones.M1 || 0) / 100) +

      Number(score.M2 || 0) *
        (Number(ponderaciones.M2 || 0) / 100) +

      Number(score.ciencias || 0) *
        (Number(ponderaciones.ciencias || 0) / 100) +

      Number(score.historia || 0) *
        (Number(ponderaciones.historia || 0) / 100);

    const puntajePonderado =
      Math.round(puntajePonderadoBruto * 100) / 100;

    // =========================================================
    // 6. COMPARAR CONTRA CORTE
    // =========================================================

    const corteHistorico = Number(latestRequirement.corte || 0);

    const diferencia =
      Math.round(
        (puntajePonderado - corteHistorico) * 100
      ) / 100;

    let estadoAdmision;

    if (diferencia >= 15) {
      estadoAdmision = 'HOLGADO';
    } else if (diferencia >= 0) {
      estadoAdmision = 'JUSTO';
    } else if (diferencia >= -15) {
      estadoAdmision = 'EN RIESGO / LISTA DE ESPERA';
    } else {
      estadoAdmision = 'MUY DIFICIL';
    }

    // =========================================================
    // 7. BUSCAR CARRERA DESAFÍO
    // =========================================================

    let challengeSuggestion = null;

    const careerTypeIds =
      (major.majorCareerTypes || [])
        .map(item => item.career_type_id)
        .filter(Boolean);

    if (careerTypeIds.length > 0) {

      /*
       * Buscar otras carreras que:
       *
       * 1. pertenezcan a alguno de los mismos CareerTypes;
       * 2. no sean la carrera actual.
       */

      const relatedMajorCareerTypes =
        await MajorCareerType.findAll({
          where: {
            career_type_id: {
              [Op.in]: careerTypeIds
            },
            major_id: {
              [Op.ne]: major.major_id
            }
          }
        });

      const candidateMajorIds = [
        ...new Set(
          relatedMajorCareerTypes.map(
            item => item.major_id
          )
        )
      ];

      if (candidateMajorIds.length > 0) {

        const candidateMajors =
          await Major.findAll({
            where: {
              major_id: {
                [Op.in]: candidateMajorIds
              }
            },
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

        const candidates = [];

        for (const candidate of candidateMajors) {

          const candidateRequirements =
            [...(candidate.requirements || [])]
              .sort(
                (a, b) =>
                  Number(b.year) -
                  Number(a.year)
              );

          if (candidateRequirements.length === 0) {
            continue;
          }

          const latestCandidateRequirement =
            candidateRequirements[0];

          const candidateCutoff =
            Number(
              latestCandidateRequirement.corte || 0
            );

          /*
           * Solo nos interesan carreras
           * más exigentes que la actual.
           */
          if (candidateCutoff <= corteHistorico) {
            continue;
          }

          candidates.push({
            major: candidate,
            cutoff: candidateCutoff,
            differenceFromCurrent:
              candidateCutoff - corteHistorico
          });
        }

        /*
         * Elegimos el desafío más cercano:
         *
         * actual = 750
         *
         * candidatos:
         * 760
         * 800
         * 850
         *
         * → 760
         *
         * Así no mandamos al usuario
         * directamente a una carrera
         * absurdamente más difícil.
         */

        candidates.sort(
          (a, b) =>
            a.differenceFromCurrent -
            b.differenceFromCurrent
        );

        if (candidates.length > 0) {

          const challenge =
            candidates[0];

          challengeSuggestion = {
            major_name:
              challenge.major.name,

            university_name:
              challenge.major.university?.name ||
              'Universidad',

            corte:
              challenge.cutoff
          };
        }
      }
    }

    // =========================================================
    // 8. RESPUESTA
    // =========================================================

    return res.status(200).json({
      success: true,

      application_id: applicationId,

      student_score: puntajePonderado,

      target_major: {
        major_id: major.major_id,

        name: major.name,

        university:
          major.university?.name ||
          'Universidad',

        historical_cutoff:
          corteHistorico,

        requirement_year:
          latestRequirement.year
      },

      admission_status:
        estadoAdmision,

      points_difference:
        diferencia,

      challenge_suggestion:
        challengeSuggestion
    });

  } catch (error) {
    console.error(
      'Error en admission_analysis:',
      error
    );

    next(error);
  }
};


export default {
  createApplication,
  getAdmissionAnalysis
};