import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id'
    },
    visitorId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      field: 'visitor_id'
    },
    prefUni: {
      type: DataTypes.STRING,
      field: 'pref_uni'
    },
    prefMajor: {
      type: DataTypes.STRING,
      field: 'pref_major'
    },
    careerType: {
      type: DataTypes.INTEGER,
      field: 'career_type'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
};