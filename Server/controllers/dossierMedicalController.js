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

    const existingDossier = await MedicalDossier.findOne({ patient: patientId, doctor: doctorId });

    if (existingDossier) {
    
        return res.status(200).json('Has a medical report');
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


exports.updateDossier = async function (req, res) {
    const patientId = req.params.patientId;
    const updatedData = req.body;

    try {
        // Retrieve the dossier ID based on the patient ID
        const dossier = await MedicalDossier.findOne({ patient: patientId });
        if (!dossier) {
            return res.status(404).json({ message: 'Dossier not found' });
        }

        // Update the dossier with the retrieved dossier ID
        const updatedDossier = await MedicalDossier.findByIdAndUpdate(
            dossier._id,
            updatedData,
            { new: true, useFindAndModify: false }
        );

        return res.json(updatedDossier);
    } catch (err) {
        console.error('Error updating dossier:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// un dossier medicale associé à un patient 
exports.getDossierByPatientId = async function (req, res) {
    const ptId = req.params.patientId;
    try{
            const dossier = await MedicalDossier.findOne({patient: ptId});
            if(!dossier){
                return res.status(404).json({ message: 'Dossier not found' });
            }

            return res.json(dossier);
    }catch(err){
        console.error('Error getting dossier:', err);

    }
}
//Listes des dossiers médicaux d'un patient
exports.getAllDossierByPatientId = async function (req, res) {

    const ptId = req.params.patientId;
    try{
            const dossiers = await MedicalDossier.find({patient: ptId}).populate('doctor', 'firstName lastName'); ;
            return res.json(dossiers);
    }catch(err){
        console.error('Error getting all dossiers:', err);

    } 
 }

 //Listes des dossiers médicaux d'un docteur
 exports.getAllDossierByDoctorId = async function (req, res) {

    const dcId = req.params.docId;
    try{
            const dossiers = await MedicalDossier.find({doctor: dcId});
            return res.json(dossiers);
    }catch(err){
        console.error('Error getting all dossiers:', err);

    } 
 }

 // GET un dossier medicale par don ID
exports.getDossierById = async function (req, res) {
    const dossierId = req.params.dossierId;
    console.log('id dossier' , dossierId);
    try{
            const dossier = await MedicalDossier.findById(dossierId).populate("doctor" , "firstName lastName");
            if(!dossier){
                return res.status(404).json({ message: 'Dossier not found' });
            }

            return res.json(dossier);
    }catch(err){
        console.error('Error getting dossier:', err);

    }
}