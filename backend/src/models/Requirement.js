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
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    puntajes: { // se deberia distribuir en las diferentes areas/puntajes
      type: DataTypes.INTEGER
    },
    corte: { 
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'requirements',
    timestamps: false
  });
};