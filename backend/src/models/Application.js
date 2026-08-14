import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Application',
    {
      application_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'application_id',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'user_id',
      },
      university_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'university_id',
      },
      major_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'major_id',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'EN_PROCESO',
        field: 'status',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      tableName: 'applications',
      timestamps: false,
    }
  );
};