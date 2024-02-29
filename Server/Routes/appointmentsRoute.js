const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appoitmentController')



router.post('/patient/:patientId' , appointmentController.createAppointment)
router.get('/all' , appointmentController.getTotalAppointments)
module.exports =  router;