import { Sequelize } from 'sequelize';
import { ENV } from './env.js';

export const sequelize = new Sequelize(
  ENV.DB.NAME,
  ENV.DB.USER,
  ENV.DB.PASSWORD,
  {
    host: ENV.DB.HOST,
    port: ENV.DB.PORT,
    dialect: 'postgres',
    logging: ENV.NODE_ENV === 'development' ? false : false, // Cambiar a console.log si se quieren ver queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[Database] Conectado exitosamente a PostgreSQL (${ENV.DB.HOST}:${ENV.DB.PORT}/${ENV.DB.NAME})`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] No se pudo conectar a PostgreSQL (${error.message}).`);
    console.warn(`[Database Warning] El backend seguirá funcionando para endpoints y simulaciones.`);
    return false;
  }
};
