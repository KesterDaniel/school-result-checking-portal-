const express = require("express")
const router = new express.Router()
const Student = require("../models/students")
const Subject = require("../models/subjects")
const Record = require("../models/records")
const middleware = require("../middleware")

router.get("/students", middleware.Teacheradmin, async(req, res)=>{
    const user = req.user
    try {
        const allStudents = await Student.find({class: user.Class})
        res.render("studentindex", {students: allStudents, user})
    } catch (error) {
        console.log(error)
    }
})

router.get("/students/new", middleware.Teacheradmin, (req, res)=>{
    res.render("newStudent")
})

router.post("/students", middleware.Teacheradmin, async(req, res)=>{
    const student = req.body.student
    const allsubjects = req.body.subject.name
    try {
        const newStudent = await Student.create(student)
        newStudent.Year = req.body.year
        newStudent.Term = req.body.term
        newStudent.class = req.user.Class
        newStudent.PortalId = "HISK" + newStudent.firstName.substring(0, 3) + newStudent.surName.substring(1,3) + newStudent.firstName.length +newStudent.surName.length 
        console.log("added student")
        allsubjects.forEach(async(subject) => {
            const newSubject = await Subject.create({name: subject})
            newSubject.Year = req.body.year
            newSubject.StudentAtt.id = newStudent.id
            newSubject.StudentAtt.FirstName = newStudent.firstName
            newSubject.StudentAtt.Surname = newStudent.surName
            newSubject.StudentAtt.MiddleName = newStudent.MiddleName
            newSubject.StudentAtt.PortalId = newStudent.PortalId
            newSubject.StudentAtt.class = newStudent.class
            newSubject.Term = req.body.term
            newSubject.StudentAtt.StudentAccess = newStudent.accessCode
            newSubject.Total = newSubject.FirstCA + newSubject.SecondCA + newSubject.Exam
            await newSubject.save()
            console.log("added subject")
        });
        await newStudent.save() 
        
        res.redirect("/students")
    } catch (error) {
        console.log(error)
    }
})

router.get("/students/:studentId", middleware.checkStudOwnership, async(req, res)=>{
    const subjects = await Subject.find({})
    try {
        const student = await Student.findById(req.params.studentId)
        const subjectsTaken = subjects.filter((subject)=>
        subject.StudentAtt.id == req.params.studentId &&
        subject.Year == student.Year &&
        subject.Term == student.Term
        )
        let total = []
        subjectsTaken.forEach((subject)=>{
            total.push(subject.Total)
        })
        const weTotal = addarr(total)
        const averageTots = weTotal/subjectsTaken.length
        res.render("scoreIndex", { student, subjectsTaken, weTotal, averageTots})
    } catch (error) {
        console.log(error)
    }
})


router.get("/students/:studentId/:subjectId/addScore", middleware.checkStudOwnership, async(req, res)=>{
    const studentid = req.params.studentId
    const subjectid = req.params.subjectId
    try {
        const student = await Student.findById(studentid)
        const subject = await Subject.findById(subjectid)
        res.render("editsubjectForm", { student, subject})
    } catch (error) {
        console.log(error)
    }
})

router.put("/students/:studentId/:subjectId/addScore", middleware.checkStudOwnership, async(req, res)=>{
    const subject = await Subject.findById(req.params.subjectId)
    const term = subject.Term
    const year = subject.Year
    const studentid = req.params.studentId
    const subjectid = req.params.subjectId
    const updatedData = req.body.subject
    
    try {
        await Subject.findByIdAndUpdate(subjectid, {
            FirstCA : parseInt(updatedData.FirstCA),
            SecondCA: parseInt(updatedData.SecondCA),
            Exam: parseInt(updatedData.Exam),
            Total : parseInt(updatedData.FirstCA)  + parseInt(updatedData.SecondCA)  + parseInt(updatedData.Exam)
        })
        console.log("updated scores")
        const student = await Student.findById(studentid)
        const subjects = await Subject.find({})
        const subjectsTaken = subjects.filter((subject)=>
        subject.Year == year &&
        subject.Term == term &&
        subject.StudentAtt.id == studentid
        )
        let total = []
        subjectsTaken.forEach((subject)=>{
            total.push(subject.Total)
        })
        const weTotal = addarr(total)
        const averageTots = weTotal/subjectsTaken.length
    res.render("scoreIndex", { student, subjectsTaken, weTotal, averageTots})
    } catch (error) {
        console.log(error)
    }
})

router.get("/students/:studentId/update", middleware.checkStudOwnership, async(req, res)=>{
    try {
        const student = await Student.findById(req.params.studentId)
        res.render("editstudform", {student})
    } catch (error) {
        console.log(error)
    }
})

router.put("/students/:studentId/update", middleware.checkStudOwnership, async(req, res)=>{
    const updatedStud = req.body.student
    try {
        await Student.findByIdAndUpdate(req.params.studentId, {
            firstName: updatedStud.firstName,
            surName: updatedStud.surName,
            middleName: updatedStud.middleName,
            sex: updatedStud.sex,
            paid: updatedStud.paid,
            PositionInClass: updatedStud.PositionInClass,
            TimesAbsent: updatedStud.TimesAbsent
            // PortalId: "HISK" + updatedStud.firstName.substring(0, 3) + updatedStud.surName.substring(1,3) + updatedStud.firstName.length + updatedStud.surName.length 
        })
        res.redirect("/students")
    } catch (error) {
        console.log(error)
    }
})

router.delete("/students/:studentId/delete", middleware.checkStudOwnership, async(req, res)=>{
    try {
        await Student.findByIdAndDelete(req.params.studentId)
        const subjects = await Subject.find({})
        const doomedSub = subjects.filter((subject)=>
        subject.StudentAtt.id == req.params.studentId
        )
        doomedSub.forEach(async(sub)=>{
            await Subject.findByIdAndDelete(sub.id)
            console.log("sub delte")
        })
        res.redirect("back")
    } catch (error) {
        console.log(error)
    }
})

router.post("/students/:studentId/publishResult", middleware.checkStudOwnership, async(req, res)=>{
    try {
        const student = await Student.findById(req.params.studentId)
        const newRecord = await Record.create({
            _id: student._id,
            firstName: student.firstName,
            surName: student.surName,
            middleName: student.middleName,
            class: student.class,
            sex: student.sex,
            paid: student.paid,
            Year: student.Year,
            Term: student.Term,
            PortalId: student.PortalId,
            PositionInClass: student.PositionInClass,
            TimesAbsent: student.TimesAbsent
        })
        await newRecord.save()
        await Student.findByIdAndRemove(req.params.studentId)
        res.redirect("back")
        console.log("done")
    } catch (error) {
        console.log(error)
    }
})

function addarr(array) {
    let sum = 0
    array.forEach((item)=>{
        sum+=item
    })
    return sum
}

module.exports = router
