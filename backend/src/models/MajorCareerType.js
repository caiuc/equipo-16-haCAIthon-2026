import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('MajorCareerType', {
    majorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'major_id'
    },
    careerTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'career_type_id'
    }
  }, {
    tableName: 'major_career_types',
    timestamps: false
  });
};
