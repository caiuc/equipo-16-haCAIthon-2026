import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id',
      },
      visitor_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        field: 'visitor_id',
      },
      pref_uni: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'pref_uni',
      },
      pref_major: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'pref_major',
      },
      career_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'career_type',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );
};