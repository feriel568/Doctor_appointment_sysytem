const express = require('express');
const router = express.Router();
const dossierMedicalController = require('../controllers/dossierMedicalController')

router.post('/create/:doctorId/:patientId', dossierMedicalController.createDossier)
router.put('/update/:patientId' , dossierMedicalController.updateDossier)
router.get('/get/:patientId' , dossierMedicalController.getDossierByPatientId) 

module.exports = router