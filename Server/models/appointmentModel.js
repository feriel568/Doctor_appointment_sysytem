const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({

    day : {
        type : Date,
        required : true

    },
    time : {
        type : Date,
        required : true
    },
    state : {
        type : String,
        enum: ['en_attente', 'confirmed', 'refused'],
        default: 'en_attente'
    },
    isAvailable : {
        type: Boolean,
        default: true
    },
    patient : {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Patient'
    },
    doctor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Doctor'
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema);