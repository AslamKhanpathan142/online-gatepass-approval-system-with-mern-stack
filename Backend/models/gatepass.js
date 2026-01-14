const { default: mongoose } = require("mongoose");

const gatePassShema = new mongoose.Schema ({
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: 'student',
        required: true
    },
    reason: {
        type: String,
        required: true,
    },
    outDateTime: {
        type: String,
        required: true,
    },
    returnDateTime: {
        type: String,
        required: true,
    },
    statusGatePass: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true,
        default: 'pending'
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('gatePass', gatePassShema)