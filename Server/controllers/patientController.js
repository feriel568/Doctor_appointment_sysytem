const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
 const uuid = require('uuid')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator');

const Patient = require('../models/patientModel');


exports.register = async function (req, res) {
    try {

        if (!emailValidator.validate(req.body.email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        // const existingUser = await Admin.findOne({ email: req.body.email }).exec();
         const existingPatient = await Patient.findOne({ username: req.body.username }).exec();




        if (existingPatient) {
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




exports.updatePatient = async function(req,res){
    try {
        const patientId = req.params.id;
        const updateData = req.body;
        const updatedPatient = await Admin.findByIdAndUpdate(
            patientId,
            updateData,
            { new: true, useFindAndModify: false }
            
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.json(updatedPatient);


    }catch(err){
        console.error('Error updating patient:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deletePatient = async function(req,res){
    try {
        const patientId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ message: 'Invalid patient ID' });
        }

        // Use findOneAndDelete to find the document by ID and delete it
        const deletedPatient = await Patient.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(patientId)
        });

        if (!deletedPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        return res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        console.error('Error deleting patient:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


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