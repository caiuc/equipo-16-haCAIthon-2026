import { sequelize, University, CareerType, Major, MajorCareerType, Requirement } from '../models/index.js';
import { loadCSVData } from '../utils/csvLoader.js';

const seedDatabase = async () => {
  console.log('🚀 Iniciando sincronización y poblado de la base de datos PostgreSQL...\n');

  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL.');

    console.log('⏳ Creando tablas en PostgreSQL (sequelize.sync force)...');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas creadas correctamente.\n');

    console.log('📂 Leyendo archivos CSV en backend/data/csv/...');
    const { universities, careerTypes, majors, majorCareerTypes, requirements } = loadCSVData();

    // 1. Insertar Universidades
    console.log(`⏳ Insertando ${universities.length} universidades...`);
    await University.bulkCreate(universities);
    console.log(`✅ Universidades insertadas.`);

    // 2. Insertar CareerTypes
    console.log(`⏳ Insertando ${careerTypes.length} tipos de carrera...`);
    await CareerType.bulkCreate(careerTypes);
    console.log(`✅ Tipos de carrera insertados.`);

    // 3. Insertar Majors
    console.log(`⏳ Insertando ${majors.length} carreras (majors)...`);
    await Major.bulkCreate(majors);
    console.log(`✅ Carreras insertadas.`);

    // 4. Insertar MajorCareerTypes
    console.log(`⏳ Insertando ${majorCareerTypes.length} relaciones carrera-área...`);
    await MajorCareerType.bulkCreate(majorCareerTypes);
    console.log(`✅ Relaciones carrera-área insertadas.`);

    // 5. Insertar Requirements
    console.log(`⏳ Insertando ${requirements.length} requisitos y cortes históricos...`);
    await Requirement.bulkCreate(requirements);
    console.log(`✅ Requisitos insertados.`);

    console.log('\n🎉 ¡BASE DE DATOS POBLADA EXITOSAMENTE CON EL DATASET OFICIAL!');
    console.log(`📊 Resumen:`);
    console.log(`   - Universidades: ${universities.length}`);
    console.log(`   - Áreas de afinidad: ${careerTypes.length}`);
    console.log(`   - Carreras: ${majors.length}`);
    console.log(`   - Relaciones N:M: ${majorCareerTypes.length}`);
    console.log(`   - Requisitos y cortes: ${requirements.length}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al poblar la base de datos:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();