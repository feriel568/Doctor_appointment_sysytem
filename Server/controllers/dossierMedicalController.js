const MedicalDossier = require('../models/dossierMedical')
const Doctor = require('../models/doctorModel')
const Patient = require('../models/patientModel')


exports.createDossier = async function(req,res) {

    const doctorId = req.params.doctorId;
    const patientId = req.params.patientId;

try{
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if(!doctor) {
        return res.status(404).json('Doctor not found');
    }

    if(!patient) {
        return res.status(404).json('Patient not found');
    }

    const {notes, meds}=req.body;

     const dossier = new MedicalDossier({
        patient: patientId,
        doctor: doctorId,
        notes: notes,
        meds: meds,
        dateOfCreation: new Date()
    });

    await dossier.save();

    res.status(201).json('Medical dossier created successfully');
}catch(err) {
    console.log(err);
}
}

exports.checkPatientDossier = async function(req, res) {
    const doctorId = req.params.doctorId;
    const patientId = req.params.patientId;

    try {
        const doctor = await Doctor.findById(doctorId);
        const patient = await Patient.findById(patientId);

        if (!doctor) {
            return res.status(404).json('Doctor not found');
        }

        if (!patient) {
            return res.status(404).json('Patient not found');
        }

        
        const existingDossier = await MedicalDossier.findOne({ patient: patientId, doctor: doctorId });

        if (existingDossier) {
        
            return res.status(200).json('Has a medical report');
        } else {
           
            return res.status(200).json('No medical report');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json('Internal Server Error');
    }
}
