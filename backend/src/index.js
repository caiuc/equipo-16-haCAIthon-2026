import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { Sequelize } from 'sequelize';
const startServer = async () => {
  console.log('🚀 Iniciando servidor backend HaCAIthon...');

  // Intentar conectar a PostgreSQL
  await connectDB();

  // Iniciar servidor HTTP
  app.listen(ENV.PORT, () => {
    console.log(`✅ Servidor Express corriendo en: http://localhost:${ENV.PORT}`);
    console.log(`📖 Documentación de endpoints en: backend/API_DOCS.md`);
    console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/health`);
  });
};

startServer();
