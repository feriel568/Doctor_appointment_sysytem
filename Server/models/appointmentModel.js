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
    isApprouved : {
        type : Boolean,
        default : false
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