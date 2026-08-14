const { Score } = require('../models'); // Importa tu modelo ORM

exports.createScore = async (req, res) => {
  try {
    const { application_id, NEM, ranking, M1, M2, c_lectora, ciencias, historia } = req.body;

    // Crear el registro asignando la fecha actual
    const newScore = await Score.create({
      application_id,
      NEM,
      ranking,
      M1,
      M2,
      c_lectora,
      ciencias,
      historia,
      date: new Date() // Equivale a Time.current
    });

    res.status(201).json(newScore);
  } catch (error) {
    res.status(422).json({ errors: error.message });
  }
};