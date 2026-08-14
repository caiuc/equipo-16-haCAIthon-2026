import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Application', {
    applicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'application_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'university_id'
    },
    majorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'major_id'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'applications',
    timestamps: false
  });
};