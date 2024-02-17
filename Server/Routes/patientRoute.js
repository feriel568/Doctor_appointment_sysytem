const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patientController');


router.post('/register' , patientController.register);
router.post('/login', patientController.signIn);
router.delete('/delete/:id', patientController.deletePatient);
router.put('/update/:id', patientController.updatePatient);
router.get('/allPatients' , patientController.getAllPatients);
router.get('/totalPatients' , patientController.getTotalNumberOfPatients);

module.exports = router;