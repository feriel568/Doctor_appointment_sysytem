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
    status : {
        type : String,
        enum: ['pending', 'approved', 'refused'],
        default: 'pending'
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
    },
    isApproved : {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Appointment', appointmentSchema);