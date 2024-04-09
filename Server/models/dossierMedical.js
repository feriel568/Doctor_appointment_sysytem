const mongoose = require('mongoose');

const  dossierMedicalSchema = mongoose.Schema({
    patient : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    doctor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Doctor'
    },
    notes : {
        type : [String],
        default : []
    },
    meds : {
        type :  [String],
        default : []

    }, 
    dateOfCreation : {
        type: Date
    }


})

module.exports = mongoose.model('MedicalDossier', dossierMedicalSchema);