const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
 const uuid = require('uuid')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator');

const Doctor = mongoose.model('Doctor')
const Admin = mongoose.model('Admin')
const Patient = require('../models/patientModel');


exports.addDoctor = async function(req,res){


try{
    if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({ message: 'Invalid email address.' });
    }
    // const existingAdmin = await Admin.findOne({ email: req.body.email }).exec();


    // if (existingAdmin) {
    //     return res.status(409).json({ message: 'User with this email already exists.' });
    // }
    const existingDoctor = await Doctor.findOne({username:req.body.username}).exec();
    if(existingDoctor){
        return res.status(200).json({ message: 'Doctor already exists.' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const verificationToken = uuid.v4();
  

    const newDoctor = new Doctor({
      ...req.body,
      password: hashedPassword,
      verificationToken: verificationToken,
      verified: false,

    });

    const savedDoctor = await newDoctor.save();
    console.log('Saved Doctor:', savedDoctor);

    sendVerificationEmail(savedDoctor.email, savedDoctor.verificationToken , savedDoctor.firstName, savedDoctor.lastName);
    savedDoctor.password = undefined;
    return res.json(savedDoctor);

}catch (err) {
    return res.status(400).send({
        message: err.message
    })
}
}

//Email verification

exports.verifyEmail = async function (req, res) {
    const verificationToken = req.params.token;

    try {
        const user = await Doctor.findOne({ verificationToken }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined; // Optional: Clear the verification token

        await user.save();

        return res.json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to send verification email
function sendVerificationEmail(email, token,firstName,lastName) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        
       
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Email Verification',
        text: `Welcome to DAS ${firstName} ${lastName}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};


exports.singnInDoctor = async function(req,res){
    try{
        const {username , password} = req.body
        if (!username || !password){
            return res.status(400).json({message: 'username ans password are required'})
        }
        const doctor = await Doctor.findOne({username}).exec()
        if(!doctor){
            return res.status(404).json({message: 'User not found'})
        }

        if (!doctor.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const userDetails = {
            id : doctor._id,
            email: doctor.email,  
            role: doctor.role,
            lastName: doctor.lastName,
            firstName: doctor.firstName
          };
        const token = jwt.sign({ username: doctor.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token, user :userDetails });

    }catch (err) {
       
        console.error('Error during authentication:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.updateDoctor = async function(req, res) {
    try {
        const doctorId = req.params.id;
        const updateData = req.body;

        // Use findOneAndUpdate to find the document by ID and update it
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true, useFindAndModify: false }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        return res.json(updatedDoctor);
    } catch (err) {
        console.error('Error updating doctor:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




exports.deleteDoctor = async function(req, res) {
    try {
        const doctorId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctor ID' });
        }

        // Use findOneAndDelete to find the document by ID and delete it
        const deletedDoctor = await Doctor.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(doctorId)
        });

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        return res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        console.error('Error deleting doctor:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getAllDoctors = async function(req, res) {
    try{
        const doctors = await Doctor.find()
    //   const totalDoctors = doctors.length;
      res.json(doctors)
    }catch(err)
    {
        console.log("Failed to fetch all doctors: " + err);
    }
};


exports.getTotalNumberOfDoctors = async function(req, res) {
    
        const doctors = await Doctor.find()
    const totalDoctors = doctors.length;
      res.json(totalDoctors)
    
};

exports.getDoctorById = async function(req,res){

    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId).then(data=>res.send(data));


    }catch(err) {

        console.log("Failed to fetch the doctor: " + err);

    }
}




exports.searchDocByName = async function(req, res) {
    try {
        const searchQuery = req.query.search; // Assuming you pass the search parameter in the query string

        // Using a case-insensitive regular expression to search by firstName and lastName
        const doctors = await Doctor.find({
            $or: [
                { firstName: { $regex: new RegExp(searchQuery, 'i') } },
                { lastName: { $regex: new RegExp(searchQuery, 'i') } },
                { specialization: {$regex : new RegExp(searchQuery, 'i')}}
            ]
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found with the given name.' });
        }

        return res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getListOfPatients = async function (req,res) {
    try {
        const doctorId = req.params.doctorId;
        const doctor= await Doctor.findById(doctorId);
        const listPatientsIds = await doctor.patients;
        const patients = await Promise.all(listPatientsIds.map(async patientId => {
            const patient = await Patient.findById(patientId);
            return patient;
        }));
        res.json(patients);
    }catch (error){
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deletePatient = async function (req, res) {
    try {
        const doctorId = req.params.doctorId;
        const patientId = req.params.patientId;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        if (doctor.patients.includes(patientId)) { 
            doctor.patients.remove(patientId);
            await doctor.save();
            return res.json({ message: 'Patient deleted from doctor\'s list' });
        } else {
            return res.status(404).json({ message: 'Patient not found in doctor\'s list' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.getTotalNumberOfPatients = async function (req, res){
    const doctorId = req.params.doctorId;

    const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const totalPatients = doctor.patients.length;
        // console.log(totalPatients);
        return res.json(totalPatients)


}