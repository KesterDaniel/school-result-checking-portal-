const express = require("express")
const router = new express.Router()
const Teacher = require("../models/teachers")
const middlewareObj = require("../middleware")

router.get("/teachers", middlewareObj.Isadmin, async(req, res)=>{
    try {
        const Teachers = await Teacher.find({})
        const allTeachers = Teachers.filter((teacher)=>
            !teacher.isAdmin
        )
        // console.log(allTeachers)
        res.render("teacherindex", { allTeachers })
    } catch (error) {
        
    }
})

router.get("/addteacher", middlewareObj.Isadmin, (req, res)=>{
    res.render("addteacherform")
})

router.post("/addteacher", middlewareObj.Isadmin, async(req, res)=>{
    const FirstName = req.body.FirstName
    const MiddleName = req.body.MiddleName
    const LastName = req.body.LastName
    const Class = req.body.Class
    const password = req.body.password
    const isAdmin = req.body.isAdmin
    const username = "IS" + FirstName.substring(0, 3) + FirstName.length + LastName.substring(2, 4)
    const newTeacher = new Teacher({FirstName, MiddleName, LastName, Class, username, isAdmin})
    try {
        await Teacher.register(newTeacher, password)
        res.redirect("/teachers")
    } catch (error) {
        console.log(error)
    }
})

router.delete("/teachers/:teacherId/delete", middlewareObj.Isadmin, async(req, res)=>{
    try {
        await Teacher.findByIdAndDelete(req.params.teacherId)
        res.redirect("back")
    } catch (error) {
        console.log(error)
    }
})


module.exports = router
