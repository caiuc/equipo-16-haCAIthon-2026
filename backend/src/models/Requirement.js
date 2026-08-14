import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Requirement',
    {
      requirement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'requirement_id',
      },
      major_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'major_id',
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'year',
      },
      puntajes: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'puntajes',
        get() {
          const raw = this.getDataValue('puntajes');
          if (!raw) return null;
          if (typeof raw === 'object') return raw;
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        },
        set(value) {
          if (typeof value === 'object') {
            this.setDataValue('puntajes', value);
          } else {
            try {
              this.setDataValue('puntajes', JSON.parse(value));
            } catch {
              this.setDataValue('puntajes', value);
            }
          }
        },
      },
      corte: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'corte',
      },
    },
    {
      tableName: 'requirements',
      timestamps: false,
    }
  );
};