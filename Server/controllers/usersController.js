const mongoose = require('mongoose')

const Doctor = mongoose.model('Doctor')
const Admin = mongoose.model('Admin')
const Patient = require('../models/patientModel');



exports.getAllUsers = async function (req, res, next) {
    try{
        const doctors = await Doctor.find();
        const admins = await Admin.find();
        const patients = await Patient.find();

        const allUsers = {
            doctors: doctors,
            admins: admins,
            patients: patients
        }
        // const totalNumberOfUsers = doctors.length + admins.length + patients.length
        res.status(200).json(allUsers)
    }catch(err){
        console.error(err);
    res.status(500).json({ message: 'Internal server error' });
    }


}


exports.getTotalUsers = async function (req, res, next) {
    
        const doctors = await Doctor.find();
        const admins = await Admin.find();
        const patients = await Patient.find();

        const totalNumberOfUsers = doctors.length + admins.length + patients.length
        res.status(200).json(totalNumberOfUsers)
}