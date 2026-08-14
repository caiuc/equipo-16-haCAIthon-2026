import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Major', {
    majorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'major_id'
    },
    uniId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'uni_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'majors',
    timestamps: false
  });
};