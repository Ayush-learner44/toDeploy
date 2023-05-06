const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../controllers/userController");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

// const user_key = process.env.USER_KEY ;
const user_key = "thisistheuserkey";

function extractToken(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    req.token = token;
    next();
  } else {
    res.status(401).send({ error: "Missing or invalid Authorization header" });
  }
}

const deleteUser = async (req, res) => {
  try {
    const userData = await UserModel.findByIdAndDelete(req.params.id);
    res.send({ msg: "User Deleted" });
   
  } catch (error) {
   
  }
};

router.post("/", User.createUser);

//To Login and generate token
router.post("/login", User.checkLogin);

//This is working perfectly
router.get("/", User.allUsers);

// If the token is correct than it returns the data of the user whose token is entered
router.get("/authUser", extractToken, (req, res) => {
  jwt.verify(req.token, user_key, (err, authData) => {
    
    if (err) {
      res.send({ msg: false, user: "auth-token-expired!, Please Login Again" });
    } else {
      res.send({ msg: true, user: authData });
    }
  });
});

//Not working don't know why, Is shows the status of the user. It is inactive or active
router.get("/profile", extractToken, (req, res) => {
  jwt.verify(req.token, user_key, async (err, authData) => {
   
    if (err) {
      res.send({ msg: false, user: "auth-token-expired!, Please Login Again" });
    } else {
      // res.send({ msg: true , user:authData });
      await User.profile(authData, res);
    }
  });
});

router.put("/update", extractToken, (req, res) => {
  jwt.verify(req.token, user_key, async (err, authData) => {
    if (err) {
      res.send({ msg: false, user: "auth-token-expired!, Please Login Again" });
    } else {
      await User.updateUser(authData, req, res);
    }
  });
});

router.delete("/:id", deleteUser);

module.exports = router;
