import { sequelize } from '../config/db.js';

// Importar factorías de definición de modelos
import defineUser from './User.js';
import defineUniversity from './University.js';
import defineMajor from './Major.js';
import defineCareerType from './CareerType.js';
import defineMajorCareerType from './MajorCareerType.js';
import defineRequirement from './Requirements.js';
import defineApplication from './Application.js';
import defineScore from './Score.js';
import defineSummary from './Summary.js';
import { Career } from './career.model.js';


// ======================================================
// INSTANCIAR MODELOS
// ======================================================

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


// ======================================================
// ASOCIACIONES
// ======================================================


// 1. University <-> Major
//    University 1 ---- N Major

University.hasMany(Major, {
  foreignKey: 'uni_id',
  as: 'majors',
});

Major.belongsTo(University, {
  foreignKey: 'uni_id',
  as: 'university',
});


// ======================================================
// 2. Major <-> CareerType
//    N:M mediante MajorCareerType
// ======================================================

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


// ======================================================
// 3. Relaciones directas con MajorCareerType
// ======================================================

Major.hasMany(MajorCareerType, {
  foreignKey: 'major_id',
  as: 'majorCareerTypes',
});

MajorCareerType.belongsTo(Major, {
  foreignKey: 'major_id',
  as: 'major',
});

CareerType.hasMany(MajorCareerType, {
  foreignKey: 'career_type_id',
  as: 'majorCareerTypes',
});

MajorCareerType.belongsTo(CareerType, {
  foreignKey: 'career_type_id',
  as: 'careerType',
});


// ======================================================
// 4. Major <-> Requirement
//    Major 1 ---- N Requirement
// ======================================================

Major.hasMany(Requirement, {
  foreignKey: 'major_id',
  as: 'requirements',
});

Requirement.belongsTo(Major, {
  foreignKey: 'major_id',
  as: 'major',
});


// ======================================================
// 5. Application <-> User
//    User 1 ---- N Application
// ======================================================

User.hasMany(Application, {
  foreignKey: 'user_id',
  as: 'applications',
});

Application.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});


// ======================================================
// 6. Application <-> University
//    University 1 ---- N Application
// ======================================================

University.hasMany(Application, {
  foreignKey: 'university_id',
  as: 'applications',
});

Application.belongsTo(University, {
  foreignKey: 'university_id',
  as: 'university',
});


// ======================================================
// 7. Application <-> Major
//    Major 1 ---- N Application
// ======================================================

Major.hasMany(Application, {
  foreignKey: 'major_id',
  as: 'applications',
});

Application.belongsTo(Major, {
  foreignKey: 'major_id',
  as: 'major',
});


// ======================================================
// 8. Application <-> Score
//    Application 1 ---- N Score
//
//    Para el flujo actual usamos `score` como
//    asociación principal del análisis.
// ======================================================

Application.hasOne(Score, {
  foreignKey: 'application_id',
  as: 'score',
});

Application.hasMany(Score, {
  foreignKey: 'application_id',
  as: 'scores',
});

Score.belongsTo(Application, {
  foreignKey: 'application_id',
  as: 'application',
});


// ======================================================
// 9. Application <-> Summary
//    Application 1 ---- 1 Summary
//
//    IMPORTANTE:
//    Summary YA NO pertenece a Score.
// ======================================================

Application.hasOne(Summary, {
  foreignKey: 'application_id',
  as: 'summary',
});

Summary.belongsTo(Application, {
  foreignKey: 'application_id',
  as: 'application',
});


// ======================================================
// EXPORT
// ======================================================

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