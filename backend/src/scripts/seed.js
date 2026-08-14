import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

import {
  sequelize,
  University,
  Major,
  CareerType,
  MajorCareerType,
  Requirement
} from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data/csv');

function readCSV(filename) {
  const filePath = path.join(DATA_DIR, filename);

  const content = fs.readFileSync(filePath, 'utf8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true
  });
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    await sequelize.authenticate();

    console.log('✓ Database connection established\n');

    const universities = readCSV('universities.csv');
    const careerTypes = readCSV('career_types.csv');
    const majors = readCSV('majors.csv');
    const majorCareerTypes = readCSV('major_career_types.csv');
    const requirements = readCSV('requirements.csv');

    console.log('CSV loaded:');
    console.log(`  Universities:        ${universities.length}`);
    console.log(`  Career Types:        ${careerTypes.length}`);
    console.log(`  Majors:              ${majors.length}`);
    console.log(`  Major Career Types:  ${majorCareerTypes.length}`);
    console.log(`  Requirements:        ${requirements.length}`);
    console.log();

    /*
     * DEVELOPMENT ONLY
     *
     * Clear tables in reverse dependency order.
     */
    console.log('🧹 Clearing existing data...');

    await Requirement.destroy({ where: {}, truncate: true, cascade: true });
    await MajorCareerType.destroy({ where: {}, truncate: true, cascade: true });
    await Major.destroy({ where: {}, truncate: true, cascade: true });
    await CareerType.destroy({ where: {}, truncate: true, cascade: true });
    await University.destroy({ where: {}, truncate: true, cascade: true });

    console.log('✓ Existing academic data cleared\n');

    /*
     * UNIVERSITIES
     */
    console.log('🏫 Inserting universities...');

    await University.bulkCreate(
      universities.map(row => ({
        uniId: Number(row.uni_id),
        name: row.name
      })),
      {
        validate: true
      }
    );

    console.log(`✓ ${universities.length} universities inserted`);

    /*
     * CAREER TYPES
     */
    console.log('📚 Inserting career types...');

    await CareerType.bulkCreate(
      careerTypes.map(row => ({
        careerTypeId: Number(row.career_type_id),
        name: row.name
      })),
      {
        validate: true
      }
    );

    console.log(`✓ ${careerTypes.length} career types inserted`);

    /*
     * MAJORS
     */
    console.log('🎓 Inserting majors...');

    await Major.bulkCreate(
      majors.map(row => ({
        majorId: Number(row.major_id),
        uniId: Number(row.uni_id),
        name: row.name
      })),
      {
        validate: true
      }
    );

    console.log(`✓ ${majors.length} majors inserted`);

    /*
     * MAJOR <-> CAREER TYPE
     */
    console.log('🔗 Inserting major-career relationships...');

    await MajorCareerType.bulkCreate(
      majorCareerTypes.map(row => ({
        majorId: Number(row.major_id),
        careerTypeId: Number(row.career_type_id)
      })),
      {
        validate: true
      }
    );

    console.log(
      `✓ ${majorCareerTypes.length} major-career relationships inserted`
    );

    /*
     * REQUIREMENTS
     */
    console.log('📊 Inserting requirements...');

    await Requirement.bulkCreate(
      requirements.map(row => ({
        requirementId: Number(row.requirement_id),
        majorId: Number(row.major_id),
        year: Number(row.year),
        puntajes:
          typeof row.puntajes === 'string'
            ? JSON.parse(row.puntajes)
            : row.puntajes,
        corte: Number(row.corte)
      })),
      {
        validate: true
      }
    );

    console.log(`✓ ${requirements.length} requirements inserted\n`);

    /*
     * VALIDATION
     */
    console.log('🔍 Validating database...\n');

    const universityCount = await University.count();
    const careerTypeCount = await CareerType.count();
    const majorCount = await Major.count();
    const majorCareerTypeCount = await MajorCareerType.count();
    const requirementCount = await Requirement.count();

    console.log(`Universities:       ${universityCount}`);
    console.log(`Career Types:       ${careerTypeCount}`);
    console.log(`Majors:             ${majorCount}`);
    console.log(`Major Career Types: ${majorCareerTypeCount}`);
    console.log(`Requirements:       ${requirementCount}`);

    console.log('\n✅ Database successfully seeded!');

  } catch (error) {
    console.error('\n❌ Seed failed:');
    console.error(error);

    process.exitCode = 1;

  } finally {
    await sequelize.close();
  }
}

seed();