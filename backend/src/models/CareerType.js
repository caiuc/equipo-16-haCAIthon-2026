import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'CareerType',
    {
      career_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'career_type_id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name',
      },
    },
    {
      tableName: 'career_types',
      timestamps: false,
    }
  );
};