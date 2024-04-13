const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
 const uuid = require('uuid')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator');

const Patient = require('../models/patientModel');
const Doctor = mongoose.model('Doctor')

const Admin = mongoose.model('Admin')

const Appointment = require('../models/appointmentModel');


exports.register = async function (req, res) {
    try {

        if (!emailValidator.validate(req.body.email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        // const existingUser = await Admin.findOne({ email: req.body.email }).exec();
        const existingAdmin = await Admin.findOne({ username: req.body.username }).exec();
         const existingPatient = await Patient.findOne({ username: req.body.username }).exec();
         const existingDoctor = await Doctor.findOne({ username: req.body.username }).exec();




        if (existingAdmin || existingPatient || existingDoctor) {
            return res.status(409).json({ message: 'User with this username already exists.' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
         const verificationToken = uuid.v4();
        const newPatient = new Patient({
            ...req.body,
            password: hashedPassword,
            verificationToken: verificationToken,
            verified : false
        });
       

        const savedPatient = await newPatient.save();
        console.log('Saved patient:', savedPatient);

        sendVerificationEmail(savedPatient.email, savedPatient.verificationToken , savedPatient.firstName, savedPatient.lastName);


        savedPatient.password = undefined;
        return res.json(savedPatient);
    } catch (err) {
        return res.status(400).send({
            message: err.message
        });
    }
}


exports.verifyEmail = async function (req, res) {
    const verificationToken = req.params.token;

    try {
        const user = await Patient.findOne({ verificationToken }).exec();

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
        subject: 'Welcome to DAS',
        text: `Hello ${firstName} ${lastName}.
        Welcome to DAS! Your account has been successfully created. 
        Here are your account details: 
        Email: ${email}
        
        Thank you for joining DAS.`,

                
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
};

exports.signIn = async function (req, res) {
    try {

        // const { email, password } = req.body;
        const { username, password } = req.body;

        // Check if email or password is empty
        // if (!email || !password) {
        //     return res.status(400).json({ message: 'Email and password are required.' });
        // }

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        

        // const user = await Admin.findOne({ email }).exec();
        const patient = await Patient.findOne({ username }).exec();


        if (!patient) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (!patient.comparePassword(password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
        }
        const userDetails = {
            id : patient._id,
            email: patient.email,  
            role: patient.role,
            lastName: patient.lastName,
            firstName: patient.firstName
          };
        const token = jwt.sign({ username: patient.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token , patient: userDetails });
    } catch (err) {
        // Handle any errors that occur during the query or authentication process
        console.error('Error during authentication:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




exports.updatePatient = async function(req, res) {
    try {
        const patientId = req.params.id;
        const updateData = req.body;

        // Check if the username is being updated and if it already exists
        if (updateData.username) {
            const existingAdmin = await Admin.findOne({ username: updateData.username });
            const existingPatient = await Patient.findOne({ username: updateData.username });
            const existingDoctor = await Doctor.findOne({ username: updateData.username });

            // Check if any existing user has the same username
            if ((existingAdmin && existingAdmin._id.toString() !== patientId) ||
                (existingPatient && existingPatient._id.toString() !== patientId) ||
                (existingDoctor && existingDoctor._id.toString() !== patientId)) {
                return res.json({ message: 'Username is already taken' });
            }
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            updateData,
            { new: true, useFindAndModify: false }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.json(updatedPatient);
    } catch (err) {
        console.error('Error updating patient:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.deletePatient = async function(req, res) {
    try {
        const patientId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }

        // Use a transaction to ensure data consistency
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find all doctors who have the patient in their list of patients
            const doctorsToUpdate = await Doctor.find({ patients: patientId });

            // Update each doctor's patients list to remove the deleted patient
            await Promise.all(doctorsToUpdate.map(async (doctor) => {
                doctor.patients.pull(patientId);
                await doctor.save({ session: session });
            }));

            // Delete appointments associated with the patient
            await Appointment.deleteMany({ patient: patientId });

            // Use findOneAndDelete to find the patient document by ID and delete it
            const deletedPatient = await Patient.findOneAndDelete(
                { _id: new mongoose.Types.ObjectId(patientId) },
                { session: session }
            );

            if (!deletedPatient) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Patient not found' });
            }

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            return res.json({ message: 'Patient and associated appointments deleted successfully' });
        } catch (err) {
            // Rollback the transaction if any error occurs
            await session.abortTransaction();
            session.endSession();
            console.error('Error deleting patient:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (err) {
        console.error('Error deleting patient:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.getAllPatients = async function(req,res){
    try{
        const patients = await Patient.find();
       
        res.status(200).json(patients);
    } catch (err) {
        console.log('Error getting patients:', err);
    }
}

exports.getTotalNumberOfPatients = async function(req,res){
    
        const patients = await Patient.find();
        const totalPatients = patients.length;
        res.status(200).json(totalPatients);
    
}

exports.getPatientById = async function(req, res) {
    try {
        const patientId = req.params.id;
        const pt = await Patient.findById(patientId);
        if (!pt) {
            return res.status(404).json({ error: "Patient not found" });
        }
        return res.json(pt);
    } catch (err) {
        console.log('Error while getting Patient', err);
        return res.status(500).json({ error: "Internal server error" });
    }
}


exports.changePassword = async function(req, res) {

    const patientId = req.params.id;
    const {oldPassword, newPassword , confirmNewPassword} = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if(!patient) {
          return  res.status(404).json({message : 'patient not found'})
        }
        // console.log(admin)

        const passwordMatch = await bcrypt.compare(oldPassword,patient.password);
      
        if(!passwordMatch) {
            return res.json({message : 'Old Password incorrect'})
        }

        if(newPassword !== confirmNewPassword) {
            return res.json({message : 'New password and confirm new password do not match'})
        }
        const hashedPassword = await bcrypt.hash(newPassword , 10)
        patient.password = hashedPassword
        await patient.save()
        return res.status(200).json({ message: 'Password updated successfully' });


    }catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });

    }

}

