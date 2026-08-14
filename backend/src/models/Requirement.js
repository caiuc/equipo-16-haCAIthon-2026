import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Requirement', {
    requirementId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'requirement_id'
    },

    majorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'major_id'
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    puntajes: {
      type: DataTypes.JSONB,
      allowNull: false
    },

    corte: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'requirements',
    timestamps: false
  });
};