

const dotenv = require("dotenv")
const cookieParser = require('cookie-parser');
const cors=require('cors')  
const mongoose=require('mongoose')
const express = require('express')
const fileUpload = require('express-fileupload')


const sendMailFun = require("./others/sendMailFun")
const Admin=require('./routes/AdminRoutes')
const User=require('./routes/UserRoutes')
const Course=require('./routes/CourseRoutes')
const path = require('path')

const port = 4000

const app = express()

//Important lines
dotenv.config();
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload({useTempFiles:true}));
app.use(cors({ origin: ["http://localhost:3000" , "http://localhost:3001"], credentials: true }))
app.use(function(req, res, next) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })

//static files serving
app.use(express.static(path.join(__dirname,'../client/build')))
  
// DB_CONN="mongodb://127.0.0.1:27017/eduportal2"
DB_CONN='mongodb+srv://AyushGupta:gZqIyNlJYKGEDmza@cluster0.c9wqjmz.mongodb.net/?retryWrites=true&w=majority'


mongoose.connect(DB_CONN,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("Database connected"))
.catch((err)=>console.error("Database connection error:", err));


//To send the mail and recover password
app.post("/mail", sendMailFun);

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname,'../client/build/index.html'))
})

app.use('/api/admin', Admin)  
app.use('/api/user', User)
app.use('/api/course', Course)

 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


 

