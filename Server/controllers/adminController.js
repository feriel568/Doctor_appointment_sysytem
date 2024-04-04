const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
 const uuid = require('uuid')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator');

const Admin = mongoose.model('Admin')
const Patient = require('../models/patientModel');
const Doctor = mongoose.model('Doctor')


exports.register = async function(req, res) {
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
        const newAdmin = new Admin({
            ...req.body,
            password: hashedPassword,
            verificationToken: verificationToken,
            verified : false
        });
       

        const savedAdmin = await newAdmin.save();
        console.log('Saved Admin:', savedAdmin);

        sendVerificationEmail(savedAdmin.email, savedAdmin.verificationToken , savedAdmin.firstName, savedAdmin.lastName);


        savedAdmin.password = undefined;
        return res.json(savedAdmin);
    } catch (err) {
        return res.status(400).send({
            message: err.message
        });
    }
};


//-----------------------
exports.verifyEmail = async function (req, res) {
    const verificationToken = req.params.token;

    try {
        const user = await Admin.findOne({ verificationToken }).exec();

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
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        

        // const user = await Admin.findOne({ email }).exec();
        const user = await Admin.findOne({ username }).exec();


        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        if (!user.comparePassword(password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
        }
        const userDetails = {
            id : user.id,
            email: user.email,  
            role: user.role,
            lastName: user.lastName,
            firstName: user.firstName
          };
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ token , user: userDetails });
    } catch (err) {
        // Handle any errors that occur during the query or authentication process
        console.error('Error during authentication:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.getAdminById = async function(req, res) {
    try {
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        return res.json(admin);
    } catch (err) {
        console.log('Error while getting admin', err);
        return res.status(500).json({ error: "Internal server error" });
    }
}



    exports.updateAdmin = async function(req, res) {
        try {
            const adminId = req.params.id;
            const updateData = req.body;
    
            // Check if the username is being updated and if it already exists
            if (updateData.username) {
                const existingAdmin = await Admin.findOne({ username: updateData.username });
                
                const existingPatient = await Patient.findOne({ username: updateData.username }).exec();
                const existingDoctor = await Doctor.findOne({ username: updateData.username }).exec();
       
       
       
       
              

                if ((existingAdmin && existingAdmin._id.toString() !== adminId) ||
                (existingPatient && existingPatient._id.toString() !== adminId)||
                (existingDoctor && existingDoctor._id.toString() !== adminId)) {
                    return res.json({ message: 'Username is already taken' });
                }
            }
    
            const updatedAdmin = await Admin.findByIdAndUpdate(
                adminId,
                updateData,
                { new: true, useFindAndModify: false }
            );
    
            if (!updatedAdmin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
    
            return res.json(updatedAdmin);
        } catch (err) {
            console.error('Error updating admin:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }


exports.deleteAdmin = async function(req,res){
    try {
        const adminId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: 'Invalid admin ID' });
        }

        // Use findOneAndDelete to find the document by ID and delete it
        const deletedAdmin = await Admin.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(adminId)
        });

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Error deleting Admin:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getAllAdmins = async function(req, res) {
    try{
       const admins = await Admin.find();
       
       res.json(admins);

    }catch (err) {
        console.log('Error getting all admins' ,err);
    }
}

exports.getTotalNumberOfAdmins = async function(req, res) {
 
       const admins = await Admin.find();
       const totalAdmins = admins.length;
       res.json(totalAdmins);

   
}


