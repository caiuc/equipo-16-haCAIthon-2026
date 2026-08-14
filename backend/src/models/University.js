import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('University', {
    uniId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'uni_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'universities',
    timestamps: false
  });
};