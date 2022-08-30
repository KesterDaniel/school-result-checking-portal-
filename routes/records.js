const express = require("express")
const router = new express.Router()
const Student = require("../models/students")
const Subject = require("../models/subjects")
const Record = require("../models/records")
const middlewareObj = require("../middleware")




router.get("/records/YT", middlewareObj.Isadmin, (req, res)=>{
    res.render("recordsYTform")
})

router.post("/records/YT", middlewareObj.Isadmin, async(req, res)=>{
    const year = req.body.year
    const term = req.body.term
    const className = req.body.class
    const allstudents = await Record.find({Year: year, Term: term, class: className})
    try {
        res.render("recordsYTindex", { allstudents })
        // res.send(allstudents)
    } catch (error) {
        console.log(error)
    }
})

router.get("/records/students/:studentId", middlewareObj.Isadmin, async(req, res)=>{
    const subjects = await Subject.find({})
    try {
        const student = await Record.findById(req.params.studentId)
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
    res.render("recordsIndex", { student, subjectsTaken, weTotal, averageTots })
    } catch (error) {
        console.log(error)
    }
})

router.get("/records/students/:studentId/update", middlewareObj.Isadmin, async(req, res)=>{
    try {
        const record = await Record.findById(req.params.studentId)
        res.render("editrecordform", {record})
    } catch (error) {
        console.log(error)
    }
})

router.put("/records/students/:studentId/update", middlewareObj.Isadmin, async(req, res)=>{
    const updatedRec = req.body.record    
    try {
        const student = await Record.findByIdAndUpdate(req.params.studentId, {
            firstName: updatedRec.firstName,
            surName: updatedRec.surName,
            middleName: updatedRec.middleName,
            sex: updatedRec.sex,
            paid: updatedRec.paid
        })
        res.redirect("/records/YT")
    } catch (error) {
        console.log(error)
    }
})

router.get("/records/students/:studentId/:subjectId/addScore", middlewareObj.Isadmin, async(req, res)=>{
    const studentid = req.params.studentId
    const subjectid = req.params.subjectId
    try {
        const student = await Record.findById(studentid)
        const subject = await Subject.findById(subjectid)
        res.render("editSubjectRecordForm", { student, subject})
    } catch (error) {
        console.log(error)
    }
})

router.put("/records/students/:studentId/:subjectId/addScore", middlewareObj.Isadmin, async(req, res)=>{
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
        const student = await Record.findById(studentid)
        const subjects = await Subject.find({})
        const subjectsTaken = subjects.filter((subject)=>
        subject.Year == year &&
        subject.Term == term &&
        subject.StudentAtt.id == studentid
        )
    res.render("recordsIndex", { student, subjectsTaken, year})
    } catch (error) {
        console.log(error)
    }
})

router.delete("/records/students/:studentId/delete", middlewareObj.Isadmin, async(req, res)=>{
    try {
        const doomedStud = await Record.findByIdAndDelete(req.params.studentId)
        const subjects = await Subject.find({})
        const doomedSub = subjects.filter((subject)=>
        subject.StudentAtt.id == req.params.studentId
        )
        doomedSub.forEach(async(sub)=>{
            await Subject.findByIdAndDelete(sub.id)
            console.log("sub delte")
        })
        // res.redirect("back")
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
