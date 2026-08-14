import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Summary',
    {
      summary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'summary_id',
      },
      score_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'score_id',
      },
      good_case: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'good_case',
      },
      medium_case: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'medium_case',
      },
      bad_case: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'bad_case',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
    },
    {
      tableName: 'summaries',
      timestamps: false,
    }
  );
};