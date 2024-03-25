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



exports.searchUser = async function (req, res, next) {
    try {
        const searchQuery = req.query.name; // Extract the name query parameter from the request

        // Create an empty object to store user data
        const allUsers = {};

        // Find doctors, admins, and patients based on the presence of a name query parameter
        if (searchQuery) {
            allUsers.doctors = await Doctor.find({
                $or: [
                    { firstName: { $regex: new RegExp(searchQuery, 'i') } },
                    { lastName: { $regex: new RegExp(searchQuery, 'i') } }
                ]
            });
            allUsers.admins = await Admin.find({
                $or: [
                    { firstName: { $regex: new RegExp(searchQuery, 'i') } },
                    { lastName: { $regex: new RegExp(searchQuery, 'i') } }
                ]
            });
            allUsers.patients = await Patient.find({
                $or: [
                    { firstName: { $regex: new RegExp(searchQuery, 'i') } },
                    { lastName: { $regex: new RegExp(searchQuery, 'i') } }
                ]
            });
        } else {
            allUsers.doctors = await Doctor.find();
            allUsers.admins = await Admin.find();
            allUsers.patients = await Patient.find();
        }

        res.status(200).json(allUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
