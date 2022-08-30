const mongoose = require("mongoose")
const subjectSchema = mongoose.Schema({
    name: String,
    Term: String,
    FirstCA: {
        type: Number,
        default: 0
    },
    SecondCA: {
        type: Number,
        default: 0
    },
    Exam: {
        type: Number,
        default: 0
    },
    Total: {
        type: Number,
        default: 0
    },
    StudentAtt: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Student"
        },
        FirstName: String,
        Surname: String,
        MiddleName: String,
        PortalId: String,
        class: String
    },
    Year: String
})

const Subject = mongoose.model("Subject", subjectSchema)

module.exports = Subject

