const mongoose = require("mongoose");

const studentShema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type: String,
        required: true
    },
    department : {
        type : String,
        required: true
    },
    course : {
        type: String,
        required: true
    },
    year : {
        type: String,
        required: true
    },
    hostel : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['admin', 'student'],
        required: true,
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('student',studentShema)