const Appointment = require('../models/appointmentModel')
const Doctor = require('../models/doctorModel')


exports.createAppointment = async function (req,res) {

    try {
          const patientId = req.params.patientId;

          const { doctor, day, time } = req.body;
  
          const doctorObj = await Doctor.findById(doctor);
  
          if (!doctorObj) {
              return res.status(404).json({ message: 'Doctor not found' });
          }
  
          // Create the appointment
          const appointment = new Appointment({
              day,
              time,
              isApproved: false,
              patient: patientId,
              doctor: doctor
          });
  
          // Save the appointment
          await appointment.save();
  
          res.status(201).json(appointment);

    }catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getTotalAppointments = async function (req, res) {
    const appointments = await Appointment.find();
    const totalAppointments = appointments.length;
    res.json(totalAppointments)
}