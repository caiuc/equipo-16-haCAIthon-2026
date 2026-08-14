import { sequelize } from '../config/db.js';
import { Career } from './career.model.js';

// Aquí se pueden asociar más modelos a futuro si normalizan la BD:
// ej: University.hasMany(Career), etc.

export { sequelize, Career };
import { Sequelize } from 'sequelize';

// Importar factorías de modelos
import defineUser from './User.js';
import defineUniversity from './University.js';
import defineMajor from './Major.js';
import defineCareerType from './CareerType.js';
import defineMajorCareerType from './MajorCareerType.js';
import defineRequirement from './Requirement.js';
import defineApplication from './Application.js';
import defineScore from './Score.js';
import defineSummary from './Summary.js';

// Instancia de conexión a PostgreSQL
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

// Inicializar modelos
export const User = defineUser(sequelize);
export const University = defineUniversity(sequelize);
export const Major = defineMajor(sequelize);
export const CareerType = defineCareerType(sequelize);
export const MajorCareerType = defineMajorCareerType(sequelize);
export const Requirement = defineRequirement(sequelize);
export const Application = defineApplication(sequelize);
export const Score = defineScore(sequelize);
export const Summary = defineSummary(sequelize);

// ==========================================
// DEFINICIÓN DE ASOCIACIONES (RELACIONES)
// ==========================================

// 1. University <-> Major (1:N)
University.hasMany(Major, { foreignKey: 'uniId', as: 'majors' });
Major.belongsTo(University, { foreignKey: 'uniId', as: 'university' });

// 2. Major <-> CareerType (N:M a través de MajorCareerType)
Major.belongsToMany(CareerType, { through: MajorCareerType, foreignKey: 'majorId', as: 'careerTypes' });
CareerType.belongsToMany(Major, { through: MajorCareerType, foreignKey: 'careerTypeId', as: 'majors' });

// 3. Major <-> Requirement (1:N)
Major.hasMany(Requirement, { foreignKey: 'majorId', as: 'requirements' });
Requirement.belongsTo(Major, { foreignKey: 'majorId', as: 'major' });

// 4. Application Foreign Keys (User, University, Major)
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

University.hasMany(Application, { foreignKey: 'universityId', as: 'applications' });
Application.belongsTo(University, { foreignKey: 'universityId', as: 'university' });

Major.hasMany(Application, { foreignKey: 'majorId', as: 'applications' });
Application.belongsTo(Major, { foreignKey: 'majorId', as: 'major' });

// 5. Application <-> Score (1:N o 1:1)
Application.hasMany(Score, { foreignKey: 'applicationId', as: 'scores' });
Score.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

// 6. Score <-> Summary (1:1 vía scoreId)
Score.hasOne(Summary, { foreignKey: 'scoreId', as: 'summary' });
Summary.belongsTo(Score, { foreignKey: 'scoreId', as: 'score' });

export default {
  sequelize,
  User,
  University,
  Major,
  CareerType,
  MajorCareerType,
  Requirement,
  Application,
  Score,
  Summary
};