import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'University',
    {
      uni_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'uni_id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name',
      },
    },
    {
      tableName: 'universities',
      timestamps: false,
    }
  );
};