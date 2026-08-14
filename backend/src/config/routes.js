const express = require('express');
const router = express.Router();
const scoresController = require('./controllers/scoresController');
const applicationsController = require('./controllers/applicationsController');

// POST /scores
router.post('/scores', scoresController.createScore);

// GET /applications/:id/admission_analysis
router.get('/applications/:id/admission_analysis', applicationsController.getAdmissionAnalysis);

module.exports = router;