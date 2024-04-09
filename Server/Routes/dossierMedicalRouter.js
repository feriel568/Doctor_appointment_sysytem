const express = require('express');
const router = express.Router();
const dossierMedicalController = require('../controllers/dossierMedicalController')

router.post('/create/:doctorId/:patientId', dossierMedicalController.createDossier)

module.exports = router