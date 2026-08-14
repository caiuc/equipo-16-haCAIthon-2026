// import { DataTypes } from 'sequelize';
// import { sequelize } from '../config/db.js';

// /**
//  * Modelo de Carrera y Ponderaciones
//  * Nota: Quien normalice la BD puede agregar, modificar campos o relaciones según sea necesario.
//  */
// export const Career = sequelize.define(
//   'Career',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     code: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       comment: 'Código DEMRE de la carrera',
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: 'Nombre de la carrera (ej: Ingeniería Civil, Medicina)',
//     },
//     university: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: 'Nombre de la universidad (ej: Pontificia Universidad Católica de Chile)',
//     },
//     location: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       comment: 'Sede / Región / Ciudad',
//     },
//     cutoffScore: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//       comment: 'Puntaje de corte del último seleccionado año anterior',
//     },
//     // Ponderaciones (porcentajes de 0 a 100)
//     pctNem: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación NEM',
//     },
//     pctRanking: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación Ranking',
//     },
//     pctLenguaje: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación Comprensión Lectora',
//     },
//     pctMat1: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación Matemática 1 (M1)',
//     },
//     pctMat2: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación Matemática 2 (M2)',
//     },
//     pctCienciasHistoria: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//       comment: 'Porcentaje ponderación Ciencias o Historia (mayor puntaje)',
//     },
//   },
//   {
//     tableName: 'careers',
//     timestamps: true,
//   }
// );
