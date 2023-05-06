const Course = require("../models/CourseModel");
const jwt = require("jsonwebtoken");

const admin_key = "thisistheadminkey";

function extractToken(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    req.token = token;
    next();
  } else {
    return null;
  }
}

const allCourses = async (req, res) => {
  try {
    const data = await Course.find();
   
    res.send(data);
  } catch (error) {
    res.send(error);
    
  }
};

const singleCourse = async (req, res) => {
  const ID = req.params.id;
  res.status(200).send(`Your Id is ${ID}`);
};

const createCourse = async (req, res) => {
  try {
    // const { department, course, weeks, start, end , exam} = req.body;
    const data = {
      Department: req.body.Department,
      Course: req.body.Course,
      Weeks: req.body.Weeks,
       StartDate:req.body.StartDate,
       EndDate:req.body.EndDate,
       ExamDate:req.body.ExamDate,
    };
   
    const result = new Course(data);
    await result.save();
    res.status(201).send({ msg: true });
  } catch (error) {
   
    res.send({msg:false})
  }
};

const updateCourse = async (req, res) => {
  try {   
    // console.log(req.params.id)
    const updatedCourse = await Course.findByIdAndUpdate( req.params.id,req.body, {
      new: true,
    });
    if (updatedCourse) {
      // console.log(updatedCourse);
      res.send({ msg: true, course: updatedCourse });
    }
  } catch (error) {
    res.send({ msg: false });
    // console.log("Error:", error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    res.send({ msg: true });
    // console.log(`Deleted ${req.params.id}`);
  } catch (error) {
    // console.log("Error:", error);
  }
};

module.exports = {
  allCourses,
  singleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
