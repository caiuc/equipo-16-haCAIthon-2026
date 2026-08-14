import { sequelize } from '../config/db.js';

// Importar factorías de definición de modelos
import defineUser from './User.js';
import defineUniversity from './University.js';
import defineMajor from './Major.js';
import defineCareerType from './CareerType.js';
import defineMajorCareerType from './MajorCareerType.js';
import defineRequirement from './Requirement.js';
import defineApplication from './Application.js';
import defineScore from './Score.js';
import defineSummary from './Summary.js';
import { Career } from './career.model.js';

// Instanciar modelos con la conexión centralizada
export const User = defineUser(sequelize);
export const University = defineUniversity(sequelize);
export const Major = defineMajor(sequelize);
export const CareerType = defineCareerType(sequelize);
export const MajorCareerType = defineMajorCareerType(sequelize);
export const Requirement = defineRequirement(sequelize);
export const Application = defineApplication(sequelize);
export const Score = defineScore(sequelize);
export const Summary = defineSummary(sequelize);
export { Career, sequelize };

// ==========================================
// DEFINICIÓN DE ASOCIACIONES (RELACIONES)
// ==========================================

// 1. University <-> Major (1:N)
University.hasMany(Major, { foreignKey: 'uni_id', as: 'majors' });
Major.belongsTo(University, { foreignKey: 'uni_id', as: 'university' });

// 2. Major <-> CareerType (N:M a través de MajorCareerType)
Major.belongsToMany(CareerType, {
  through: MajorCareerType,
  foreignKey: 'major_id',
  otherKey: 'career_type_id',
  as: 'careerTypes',
});
CareerType.belongsToMany(Major, {
  through: MajorCareerType,
  foreignKey: 'career_type_id',
  otherKey: 'major_id',
  as: 'majors',
});

// 3. Relación directa con MajorCareerType
Major.hasMany(MajorCareerType, { foreignKey: 'major_id', as: 'majorCareerTypes' });
MajorCareerType.belongsTo(Major, { foreignKey: 'major_id', as: 'major' });
CareerType.hasMany(MajorCareerType, { foreignKey: 'career_type_id', as: 'majorCareerTypes' });
MajorCareerType.belongsTo(CareerType, { foreignKey: 'career_type_id', as: 'careerType' });

// 4. Major <-> Requirement (1:N)
Major.hasMany(Requirement, { foreignKey: 'major_id', as: 'requirements' });
Requirement.belongsTo(Major, { foreignKey: 'major_id', as: 'major' });

// 5. Application Foreign Keys (User, University, Major)
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

University.hasMany(Application, { foreignKey: 'university_id', as: 'applications' });
Application.belongsTo(University, { foreignKey: 'university_id', as: 'university' });

Major.hasMany(Application, { foreignKey: 'major_id', as: 'applications' });
Application.belongsTo(Major, { foreignKey: 'major_id', as: 'major' });

// 6. Application <-> Score (1:1 / 1:N)
Application.hasOne(Score, { foreignKey: 'application_id', as: 'score' });
Application.hasMany(Score, { foreignKey: 'application_id', as: 'scores' });
Score.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

// 7. Score <-> Summary (1:1)
Score.hasOne(Summary, { foreignKey: 'score_id', as: 'summary' });
Summary.belongsTo(Score, { foreignKey: 'score_id', as: 'score' });

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
  Summary,
  Career,
};