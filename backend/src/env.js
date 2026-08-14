import 'dotenv/config';

export const ENV = {
  PORT: process.env.PORT || 4000,

  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY,
    MODEL: process.env.GEMINI_MODEL || 'gemini-3.5-flash'
  },

  DB: {
    NAME: process.env.DB_NAME,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT
  }
};