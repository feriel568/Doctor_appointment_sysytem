const  mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const doctorSchema = mongoose.Schema({

    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 6
    },
    gender : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    fee : {
        type : Number,
        required : true
    },
    specialization : {
        type : String,
        required : true
    },
    verificationToken: {
        type: String,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    }, 
    days : [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    role : { type: String, default : 'doctor'},
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default : []
    }]
   

});

doctorSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('Doctor' , doctorSchema);