var mongoose = require("mongoose");

var CourseSchema = new mongoose.Schema({
  Department: String,
  Course: String,
  Weeks: Number,
  StartDate: {
    type: String,
  },
  EndDate: {
    type: String,
  },
  ExamDate: {
    type: String,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
