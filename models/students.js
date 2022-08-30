const mongoose = require("mongoose")
const studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        uppercase: true
        
    },
    surName: {
        type: String,
        uppercase: true
    },
    middleName: {
        type: String,
        uppercase: true
    },
    class: {
        type: String
    },
    sex: {
        type: String
    },
    paid: {
        type: Boolean,
        default: false
    },
    Year: String,
    Term: String,
    PortalId: String,
    image: String,
    PositionInClass: {
        type: Number,
        default: 0
    },
    TimesAbsent: {
        type: Number,
        default: 0
    }
})

const Student = mongoose.model("Student", studentSchema)

module.exports = Student