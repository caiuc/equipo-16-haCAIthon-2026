import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Score', {
    scoreId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'score_id'
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'application_id'
    },
    nem: {
      type: DataTypes.INTEGER,
      field: 'nem'
    },
    ranking: {
      type: DataTypes.INTEGER
    },
    m1: {
      type: DataTypes.INTEGER
    },
    m2: {
      type: DataTypes.INTEGER
    },
    cLectora: {
      type: DataTypes.INTEGER,
      field: 'c_lectora'
    },
    ciencias: {
      type: DataTypes.INTEGER
    },
    historia: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATEONLY
    }
  }, {
    tableName: 'scores',
    timestamps: false
  });
};