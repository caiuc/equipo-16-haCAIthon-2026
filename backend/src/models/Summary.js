import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Summary', {
    summaryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'summary_id'
    },
    scoreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Asegura la relación 1:1
      field: 'score_id'
    },
    goodCase: {
      type: DataTypes.TEXT,
      field: 'good_case'
    },
    mediumCase: {
      type: DataTypes.TEXT,
      field: 'medium_case'
    },
    badCase: {
      type: DataTypes.TEXT,
      field: 'bad_case'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'summaries',
    timestamps: false
  });
};