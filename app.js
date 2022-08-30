const express = require("express")
const app = express()
const port = 3000 || process.env.PORT
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const passport = require("passport")
const expressSession = require("express-session")
const LocalStrategy = require("passport-local")
const passportLocalMongose = require("passport-local-mongoose")
// const flash = require("connect-flash")
const Teacher = require("./models/teachers")
// const Admin = require("./models/admin")
const Student = require("./models/students")
const Subject = require("./models/subjects")
const Record = require("./models/records")
const studentRoute = require("./routes/students")
const recordRoute = require("./routes/records")
const teacherRoute = require("./routes/teachers")
// const https = require('https')
const axios = require("axios")
const { render } = require("ejs")
const middlewareObj = require("./middleware")

mongoose.connect('mongodb://127.0.0.1:27017/School-Site', {
    useUnifiedTopology: true
})



app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))   
app.use(express.static("public"))
app.use(methodOverride("_method"))
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

passport.use("local", new LocalStrategy(Teacher.authenticate()))
passport.deserializeUser(Teacher.deserializeUser())
passport.serializeUser(Teacher.serializeUser())

app.use(studentRoute)
app.use(recordRoute)
app.use(teacherRoute)

app.get("/", (req, res)=>{
    res.render("home")
})

app.get("/adminhome", middlewareObj.Isadmin, (req, res)=>{
    res.render("adminhome")
})

const AdminSignUp= async()=>{
    const username = "H89I17KS20"
    const isAdmin = true
    const password = "090873675876"
    const newAdmin = new Teacher({username, isAdmin})
    try {
        Teacher.register(newAdmin, password)
        passport.authenticate("local")(req, res, function(){
            console.log("admin added")
        })
        console.log("done")
    } catch (error) {
        console.log(error)
    }
}


app.get("/Hisk341/Auth/admin", (req, res)=>{
    res.render("adminlogin")
})

app.post("/adminLogin", passport.authenticate("local"), async(req, res)=>{
    const user = req.user
    try {
        if(user.isAdmin){
            res.redirect("/adminhome")
         }else{
            //  const allStudents = await Student.find({class: user.Class})
            //  res.render("studentindex", {students: allStudents, user})
            console.log("teacher signins")
            res.redirect("/students")
         }
    } catch (error) {
        console.log(error)
    }
})

app.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
    })
    console.log("logged you out")
    res.redirect("/Hisk341/Auth/admin")
})




app.get("/resultcheck", async(req, res)=>{
    res.render("resultForm")
})

app.post("/resultcheck", async(req, res)=>{
    const PortalId = req.body.PortalId
    const year = req.body.Year
    const term = req.body.Term
    try {
        const allStudents = await Record.find({
            PortalId: PortalId,
        })
        const students = allStudents.filter((student)=>
            student.Year == year &&
            student.Term == term
        )
        const student = students[0]
        const classmate = await Record.find({class: student.class, Year: student.Year, Term: student.Term})
       const allsubjects = await Subject.find({})
       if(term == "Third Term"){
        // const firstTerm = allsubjects.filter((subject)=>
        //     subject.Term == 1 &&
        //     subject.Year == year &&
        //     subject.StudentAtt.PortalId == PortalId
        // )
        // const secondTerm = allsubjects.filter((subject)=>
        //     subject.Term == 2 &&
        //     subject.Year == year &&
        //     subject.StudentAtt.PortalId == PortalId
        // )
        // const thirdTerm = allsubjects.filter((subject)=>
        //     subject.Term == 3 &&
        //     subject.Year == year &&
        //     subject.StudentAtt.PortalId == PortalId
        // )
        return res.send("It will be provided by the school board")
       }else{
            const Termsubjects = allsubjects.filter((subject)=>
                subject.Term == term &&
                subject.Year == year &&
                subject.StudentAtt.PortalId == PortalId
            )
            let total = []
            Termsubjects.forEach((subject)=>{
                total.push(subject.Total)
            })
            const weTotal = addarr(total)
            const averageTots = weTotal/Termsubjects.length
            if (Termsubjects.length == 0) {
                return res.send("could not find result")
            } else if (student.paid === false) {
                return res.send("you have to pay bills to access")
            } else {
                res.render("termresult", {student, Termsubjects, weTotal, averageTots, classmate})
                // return student
            }
       }
    } catch (error) {
        console.log(error)
    }
})

app.get("/payfees", (req, res)=>{
    res.redirect("https://paystack.com/pay/school-fees-pay")
})

app.get("/payment/confirm", async(req, res)=>{
    const ref  = req.query.reference;
    const url = `https://api.paystack.co/transaction/verify/${ref}`;
    try {
        const response = await axios({
            url,
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: process.env.SECRET_KEY,
            },
          });
          if (response) {
                console.log(response.data);
          }else{
              console.log("nothing")
          }
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


app.listen(port, ()=>{
    console.log("school app running")
})