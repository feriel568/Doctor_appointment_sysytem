const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appoitmentController')



router.post('/patient/:patientId' , appointmentController.createAppointment)
router.get('/patient/:patientId' , appointmentController.getAppointments)
router.get('/patient/totalAppointments/:patientId' , appointmentController.getTotalAppointmentsForPatient)
router.get('/all' , appointmentController.getTotalAppointments)
router.get('/doctor/:doctorId' , appointmentController.getAppointmentsByDoctor)
router.get('/doctor/totalAppointments/:doctorId' , appointmentController.getTotalAppointmentsForDoctor)
router.delete('/delete/:appointmentId' , appointmentController.deleteAnAppointment)
router.patch('/doctor/approve/:appointmentId' , appointmentController.approveAppointment)
router.patch('/doctor/refuse/:appointmentId' , appointmentController.refuseAppointment)


module.exports =  router;