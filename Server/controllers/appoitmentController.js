const Appointment = require('../models/appointmentModel')
const Doctor = require('../models/doctorModel')
const Patient = require('../models/patientModel')


exports.createAppointment = async function (req, res) {
  try {
      const patientId = req.params.patientId;
      const { doctor, day, time, state } = req.body;
      console.log(day, time, state);

      // 1. Check if the doctor exists
      const doctorObj = await Doctor.findById(doctor);
      if (!doctorObj) {
          return res.status(404).json({ message: 'Doctor not found' });
      }

      const selectedDate = new Date(day);

      // 2. Check if the selected day is included in the doctor's working days
      const selectedDayIndex = selectedDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const selectedDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDayIndex];

        if (!doctorObj.days.includes(selectedDay)) {
            return res.json({ message: 'The doctor does not work on the selected day.' });
        }

      // 2. Check for existing appointments
      const existingAppointment = await Appointment.findOne({ doctor: doctorObj._id, day: day, time: time, isAvailable: false });
      if (existingAppointment) {
          return res.json({ message: 'An appointment already exists for the selected date and time.' });
      }

      // 3. Validate appointment time against doctor's working hours
       const selectedTime = new Date(`${time}`);
      //  const selectedDTime = selectedTime.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);
      const [startHour, startMinute] = doctorObj.startTime.split(':').map(Number);
      const [endHour, endMinute] = doctorObj.endTime.split(':').map(Number);
      
      const doctorStartTime = new Date(day);
      doctorStartTime.setUTCHours(startHour, startMinute, 0);
      
      const doctorEndTime = new Date(day);
      doctorEndTime.setUTCHours(endHour, endMinute, 0);
      

        console.log("selected time: ", selectedTime);
        console.log("doc start time: ", doctorStartTime);
        console.log("doc end time: ", doctorEndTime);

        if (!(selectedTime >= doctorStartTime && selectedTime <= doctorEndTime)) {
            return res.json({ message: 'The selected time is not available during the doctor\'s working hours.' });
        }



        const thirtyMinutesAfterSelectedTime = new Date(selectedTime);
thirtyMinutesAfterSelectedTime.setMinutes(thirtyMinutesAfterSelectedTime.getMinutes() + 29);

const existingAppointmentWithinThirtyMinutes = await Appointment.findOne({
    doctor: doctorObj._id,
    day: day,
    time: {
        $gte: selectedTime,
        $lt: thirtyMinutesAfterSelectedTime  
    },
    isAvailable: false
});

if (existingAppointmentWithinThirtyMinutes) {
    return res.json({ message: 'Another appointment is already scheduled within 30 minutes.' });
}

const patient = await Patient.findById(patientId);

if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
} 

if(doctorObj.patients.includes(patientId)){
    console.log('Patient already in patients array');

}else {
    doctorObj.patients.push(patient);
}
// 8. Save the updated doctor object
await doctorObj.save();

      // Save the appointment
      const appointment = new Appointment({
          day,
          time,
          state,
          isAvailable: false,
          patient: patientId,
          doctor: doctorObj._id
      });

      await appointment.save();

      res.status(201).json(appointment);
  } catch (error) {
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
        const patientId = req.params.patientId;

        // Retrieve appointments for the connected patient
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'firstName lastName phone'); // Populate the doctor details if needed

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



exports.getAppointmentsByDoctor= async function(req, res) {
    try {
        const doctorId = req.params.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId}).populate('patient' , 'firstName lastName email address phone');
        res.json(appointments);
    }catch (error) {
        console.error(error);
    }
}

exports.getAppointmentsApprovedByDoctor = async function(req, res) {
    try {
        const doctorId = req.params.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId, isApproved: true });
        const totalAppointmentsApproved = appointments.length;
        res.json(totalAppointmentsApproved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getAppointmentsRefusedByDoctor = async function(req, res) {
    try {
        const doctorId = req.params.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId, status: "refused" });
        const totalAppointmentsRefused = appointments.length;
        res.json(totalAppointmentsRefused);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getAppointmentsPendingByDoctor = async function(req, res) {
    try {
        const doctorId = req.params.doctorId;
        const appointments = await Appointment.find({ doctor: doctorId, status: "pending" });
        const totalAppointmentsPending = appointments.length;
        res.json(totalAppointmentsPending);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getTotalAppointmentsForDoctor = async function(req, res) {
    const doctorId = req.params.doctorId;

    const apps = await Appointment.find({ doctor: doctorId})
    const totalAppPatient = apps.length;
    res.status(200).json(totalAppPatient)
}

exports.deleteAnAppointment = async function(req, res) {

    try {
        const appointmentId = req.params.appointmentId;
    
        // Check if the appointment exists
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
        }
        await Appointment.findByIdAndDelete(appointmentId);
        res.json({ message: 'Appointment deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

}




exports.approveAppointment = async function (req, res) {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.isApproved) {
            return res.json({ message: 'Appointment is already approved' });
        }

        if (appointment.status === 'pending') {
            appointment.isApproved = true;
            appointment.status = 'approved';
            await appointment.save(); // Save the changes to the database
        } else {
            return res.status(400).json({ message: 'Appointment status is not pending' });
        }

        return res.json({ message: 'Approved Appointment' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.refuseAppointment = async function (req, res) {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // if (appointment.isApproved) {
        //     return res.json({ message: 'Appointment is already approved' });
        // }

        if (appointment.status === 'pending') {
            appointment.isApproved = false;
            appointment.status = 'refused';
            await appointment.save(); // Save the changes to the database
        } else {
            return res.status(400).json({ message: 'Appointment status is not pending' });
        }

        return res.json({ message: 'Refused Appointment' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
