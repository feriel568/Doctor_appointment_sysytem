const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appoitmentController')



router.post('/patient/:patientId' , appointmentController.createAppointment)
router.get('/patient/:patientId' , appointmentController.getAppointments)
router.get('/patient/totalAppointments/:patientId' , appointmentController.getTotalAppointmentsForPatient)
router.get('/all' , appointmentController.getTotalAppointments)


module.exports =  router;