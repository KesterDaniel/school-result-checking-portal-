const mongoose = require("mongoose")
const PassportLocalMongoose = require("passport-local-mongoose")
const teacherSchema = mongoose.Schema({
    FirstName: {
        type: String,
        uppercase: true
    },
    MiddleName: {
        type: String,
        uppercase: true
    },
    LastName: {
        type: String,
        uppercase: true
    },
    Class: {
        type: String,
        unique: true
    },
    password: String,
    username: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

teacherSchema.plugin(PassportLocalMongoose)

const Teacher = mongoose.model("Teacher", teacherSchema)

module.exports = Teacher