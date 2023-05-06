const router=require('express').Router();
const Course = require('../controllers/courseController')
const jwt = require("jsonwebtoken")

const admin_key = "thisistheadminkey";

router.get('/', Course.allCourses);  //async (req, res) => { res.write('<h1>This is heading</h1>')  res.end() }

router.post('/', Course.createCourse)

router.put('/:id', Course.updateCourse);

router.delete('/:id', Course.deleteCourse);

module.exports=router;


