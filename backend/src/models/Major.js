import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Major',
    {
      major_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'major_id',
      },
      uni_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'uni_id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name',
      },
    },
    {
      tableName: 'majors',
      timestamps: false,
    }
  );
};