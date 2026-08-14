import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'MajorCareerType',
    {
      major_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'major_id',
      },
      career_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'career_type_id',
      },
    },
    {
      tableName: 'major_career_types',
      timestamps: false,
    }
  );
};
