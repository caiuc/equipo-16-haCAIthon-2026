const { Application, Score, Major, Requirement, MajorCareerType, University } = require('../models');
const { Op } = require('sequelize'); // Operadores de Sequelize (>, <, !=, etc.)

exports.getAdmissionAnalysis = async (req, res) => {
  try {
    const applicationId = req.params.id;

    // 1. Buscar la postulación con sus relaciones (Score, Major y Requirements)
    const application = await Application.findByPk(applicationId, {
      include: [
        { model: Score, as: 'score' },
        { 
          model: Major, 
          as: 'major',
          include: [
            { model: Requirement, as: 'requirements' },
            { model: University, as: 'university' }
          ]
        }
      ]
    });

    if (!application || !application.score) {
      return res.status(404).json({ error: 'Postulación no encontrada o sin puntajes registrados' });
    }

    const score = application.score;
    const major = application.major;

    // 2. Obtener el requisito más reciente (ordenar por año descendente)
    // Asumiendo que requirements es un array
    const requirements = major.requirements.sort((a, b) => b.year - a.year);
    const latestRequirement = requirements[0];

    if (!latestRequirement) {
      return res.status(404).json({ error: 'No hay datos históricos para esta carrera' });
    }

    // Convertimos string JSON a Objeto si tu BD lo guarda como texto plano:
    let ponderaciones = latestRequirement.puntajes;
    if (typeof ponderaciones === 'string') {
      ponderaciones = JSON.parse(ponderaciones);
    }

    // 3. CALCULAR EL PUNTAJE PONDERADO DEL ALUMNO
    const puntajePonderadoBruto = (
      (score.NEM * (ponderaciones.NEM / 100)) +
      (score.ranking * (ponderaciones.ranking / 100)) +
      (score.c_lectora * (ponderaciones.c_lectora / 100)) +
      (score.M1 * (ponderaciones.M1 / 100)) +
      (score.M2 * (ponderaciones.M2 / 100)) +
      (score.ciencias * (ponderaciones.ciencias / 100)) +
      (score.historia * (ponderaciones.historia / 100))
    );
    
    // Redondear a 2 decimales
    const puntajePonderado = Math.round(puntajePonderadoBruto * 100) / 100; 

    // 4. EVALUACIÓN DE INGRESO
    const corteHistorico = parseFloat(latestRequirement.corte);
    const diferencia = Math.round((puntajePonderado - corteHistorico) * 100) / 100;

    let estadoAdmision = "";
    if (diferencia >= 15) {
      estadoAdmision = "HOLGADO";
    } else if (diferencia >= 0) {
      estadoAdmision = "JUSTO";
    } else if (diferencia >= -15) {
      estadoAdmision = "EN RIESGO / LISTA DE ESPERA";
    } else {
      estadoAdmision = "MUY DIFICIL";
    }

    // 5. BUSCAR UNA CARRERA SUPERIOR EN EL MISMO CAREER TYPE
    // Primero, obtenemos los IDs de los CareerType de la carrera actual
    const careerTypes = await MajorCareerType.findAll({
      where: { major_id: major.major_id } // Usa el ID primario según tu ER
    });
    const careerTypeIds = careerTypes.map(ct => ct.career_type_id);

    // Buscar la carrera "Desafío" (Corte mayor, mismo grupo, distinto ID)
    const sugerenciaSuperior = await Major.findOne({
      include: [
        {
          model: MajorCareerType,
          as: 'majorCareerTypes', // Nombre del alias en tu modelo
          where: { career_type_id: { [Op.in]: careerTypeIds } }
        },
        {
          model: Requirement,
          as: 'requirements',
          where: {
            year: latestRequirement.year,
            corte: { [Op.gt]: corteHistorico } // Op.gt = Greater Than (Mayor que)
          }
        },
        {
          model: University,
          as: 'university'
        }
      ],
      where: {
        major_id: { [Op.ne]: major.major_id } // Excluir la misma carrera (Op.ne = Not Equal)
      },
      order: [
        [{ model: Requirement, as: 'requirements' }, 'corte', 'ASC'] // Ordenar ascendente para sugerir la más cercana hacia arriba
      ]
    });

    // Formatear la sugerencia si se encuentra una
    let sugerenciaData = null;
    if (sugerenciaSuperior) {
      const reqSug = sugerenciaSuperior.requirements[0]; // El include ya filtró por año
      sugerenciaData = {
        major_name: sugerenciaSuperior.name,
        university_name: sugerenciaSuperior.university.name,
        corte: reqSug.corte
      };
    }

    // 6. RESPONDER CON EL ANÁLISIS
    return res.status(200).json({
      student_score: puntajePonderado,
      target_major: {
        name: major.name,
        university: major.university.name,
        historical_cutoff: corteHistorico
      },
      admission_status: estadoAdmision,
      points_difference: diferencia,
      challenge_suggestion: sugerenciaData
    });

  } catch (error) {
    console.error("Error en admission_analysis:", error);
    return res.status(500).json({ error: 'Error interno del servidor procesando el cálculo.' });
  }
};