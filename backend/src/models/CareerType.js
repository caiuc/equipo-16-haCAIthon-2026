import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('CareerType', {
    careerTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'career_type_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'career_types',
    timestamps: false
  });
};