import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Score',
    {
      score_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'score_id',
      },
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'application_id',
      },
      NEM: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'nem',
      },
      ranking: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'ranking',
      },
      M1: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'm1',
      },
      M2: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        field: 'm2',
      },
      c_lectora: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'c_lectora',
      },
      ciencias: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        field: 'ciencias',
      },
      historia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        field: 'historia',
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'date',
      },
    },
    {
      tableName: 'scores',
      timestamps: false,
    }
  );
};