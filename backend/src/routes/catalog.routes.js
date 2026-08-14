import { Router } from 'express';
import {
  getUniversities,
  getCareerTypes,
  getMajors,
  getMajorRequirements,
} from '../controllers/catalog.controller.js';

const router = Router();

// GET /universities - Listado de todas las universidades
router.get('/universities', getUniversities);

// GET /career_types - Listado de grupos de afinidad / tipos de carrera
router.get('/career_types', getCareerTypes);

// GET /majors - Listado de carreras con su universidad asociada
router.get('/majors', getMajors);

// GET /majors/:major_id/requirements - Requisitos y cortes históricos de una carrera
router.get('/majors/:major_id/requirements', getMajorRequirements);

export default router;
