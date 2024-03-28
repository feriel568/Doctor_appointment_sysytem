const express = require('express')
const router = express.Router()
const doctorController = require('../controllers/doctorController');


router.post('/addDoctor' , doctorController.addDoctor);
router.post('/login', doctorController.singnInDoctor);
router.put('/update/:id', doctorController.updateDoctor);
router.delete('/delete/:id', doctorController.deleteDoctor);
router.get('/allDoctors', doctorController.getAllDoctors);
router.get('/totalDoctors', doctorController.getTotalNumberOfDoctors);
router.get('/getDoctor/:id', doctorController.getDoctorById);
router.get('/searchDoctor' , doctorController.searchDocByName);
router.get('/listPatients/:doctorId' , doctorController.getListOfPatients)
router.delete('/deletePatient/:doctorId/:patientId' , doctorController.deletePatient)
router.get('/getTotalNumberOfPatients/:doctorId', doctorController.getTotalNumberOfPatients)

module.exports = router;