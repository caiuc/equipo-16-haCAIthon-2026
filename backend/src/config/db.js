import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'hacaithon_db',
  process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASS || process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
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
    console.log(`[Database] Conectado exitosamente a PostgreSQL (${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'hacaithon_db'})`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] No se pudo conectar a PostgreSQL (${error.message}).`);
    console.warn(`[Database Warning] El backend utilizará los datos del dataset CSV local.`);
    return false;
  }
};

export default sequelize;