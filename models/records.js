const mongoose = require("mongoose")
const Subject = require("./subjects")
const RecordSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    surName: {
        type: String,
    },
    middleName: {
        type: String,
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
    PositionInClass: {
        type: Number,
        default: 0
    },
    TimesAbsent: {
        type: Number,
        default: 0
    }
})


const Record = mongoose.model("Record", RecordSchema)

module.exports = Record