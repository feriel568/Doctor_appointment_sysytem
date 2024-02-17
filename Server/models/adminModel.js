const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = mongoose.Schema({
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
    verificationToken: {
        type: String,
        default: null
    },
    verified: {
        type: Boolean,
        default: false
    },
    role : {
        type : String,
        default: 'admin'
    }
});

adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password) ;
};

module.exports = mongoose.model('Admin', adminSchema);