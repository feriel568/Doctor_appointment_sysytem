const express = require('express');
const router = express.Router();
const dossierMedicalController = require('../controllers/dossierMedicalController')

router.post('/create/:doctorId/:patientId', dossierMedicalController.createDossier)
router.put('/update/:patientId' , dossierMedicalController.updateDossier)
router.get('/get/:patientId' , dossierMedicalController.getDossierByPatientId) 
router.get('/getAll/:patientId' , dossierMedicalController.getAllDossierByPatientId)
router.get('/getAll/:docId' , dossierMedicalController.getAllDossierByDoctorId)
router.get('/getDossier/:dossierId' , dossierMedicalController.getDossierById)
router.delete('/delete/:doctorId/:patientId' , dossierMedicalController.deleteDossierByDoctor)


module.exports = router