import { sequelize } from '../config/db.js';
import { Career } from './career.model.js';

// Aquí se pueden asociar más modelos a futuro si normalizan la BD:
// ej: University.hasMany(Career), etc.

export { sequelize, Career };
