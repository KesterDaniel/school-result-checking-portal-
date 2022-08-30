const Teacher = require("../models/teachers")
const Student = require("../models/students")

const middlewareObj = {}

middlewareObj.Isadmin = function(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin){
        return next()
    }
    console.log("you dont have permission for dat")
    res.redirect("back")
}

middlewareObj.Teacheradmin = function(req, res, next){
    if(req.isAuthenticated() && !req.user.isAdmin){
        return next()
    }
    console.log("This action can only be performed by a form teacher")
    res.redirect("back")
}

middlewareObj.checkStudOwnership = async function(req, res, next){
    if(req.isAuthenticated() && !req.user.isAdmin){
        try {
          const student = await Student.findById(req.params.studentId)
          if(student.class == req.user.Class){
            next()
          }else{
            console.log("No permission to do that")
            res.redirect("back")
          }  
        } catch (error) {
            console.log("student not found")
            res.redirect("back")
        }
    }else{
        console.log("you need to be logged in")
        res.redirect("back")
    }
}

module.exports = middlewareObj