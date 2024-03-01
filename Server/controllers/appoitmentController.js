const Appointment = require('../models/appointmentModel')
const Doctor = require('../models/doctorModel')


exports.createAppointment = async function (req,res) {

    try {
          const patientId = req.params.patientId;

          const { doctor, day, time , state} = req.body;
  
          const doctorObj = await Doctor.findById(doctor);
  
          if (!doctorObj) {
              return res.status(404).json({ message: 'Doctor not found' });
          }
  
          // Create the appointment
          const appointment = new Appointment({
              day,
              time,
              state,
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


exports.getAppointments = async function (req, res) {

    try {
        // Assuming you have a way to authenticate the patient and get their ID
        const patientId = req.params.patientId;

        // Retrieve appointments for the connected patient
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'firstName lastName'); // Populate the doctor details if needed

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getTotalAppointmentsForPatient = async function(req, res) {
    const patientId = req.params.patientId;

    const apps = await Appointment.find({ patient: patientId})
    const totalAppPatient = apps.length;
    res.json(totalAppPatient)
}