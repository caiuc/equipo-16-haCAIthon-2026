import { sequelize } from '../models/index.js';

try {
  console.log('🔌 Conectando a PostgreSQL...');

  await sequelize.authenticate();

  console.log('✅ PostgreSQL conectado');

  await sequelize.sync();

  console.log('✅ Tablas creadas correctamente');

  await sequelize.close();
} catch (error) {
  console.error('❌ Error creando las tablas:');
  console.error(error);
  process.exit(1);
}