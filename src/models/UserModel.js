var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    require: true,
  },
  UserEmail: {
    type: String,
    require: true,
  },
  UserMobile: {
    type: Number,
    require: true,
  },
  UserPassword: {
    type: String,
    require: true,
  },
  UserDOB: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  UserStatus: {
    type: String,
    default: "pending",
    require: true,
  },  
  UserPhoto: {
    type: String,
    default: "...",
  },
  token:{
    type: String,        
  }  
});



module.exports = mongoose.model("user", UserSchema, 'Users');
