const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const sendMailFun = require("../others/sendMailFun");


const auth_key = "thisistheuserkey";

const allUsers = async (req,res) => {
  try {
    // console.log("Showing Data...");
    const userData = await User.find({}, { token: 0 });
    // console.log(userData);
    res.send(userData);
  } catch (error) {
    // console.log("Error:", error);
  }
};

const profile = async (authData, res) => {
  const userId = authData.userId;
  
  const userData = await User.findOne({ _id: userId }, { token: 0 });
  if (userData) {
    res.send({ msg: true, user: userData });
    
  } else {
    res.send({ msg: false, user: userData });
    
  }
};

const checkLogin = async (req, res) => {
  const { UserEmail, UserPassword } = req.body;

 

  try {
    const userData = await User.findOne({ UserEmail });
    if (!userData) {
      res.send({ msg: false });
      return;
    }
    
    const userId = userData._id;
    if (userData) {
      bcrypt.compare(
        UserPassword,
        userData.UserPassword,
        function (err, result) {
          if (err) {
            res.status(500).json({ msg: err });
          } else {
            if (result) {
              jwt.sign(
                { userId },
                auth_key,
                { expiresIn: "5min" },
                async function (err, token) {
                  res.json({ msg: result, token: token });
                  userData.token = token;
                  await userData.save();
                }
              );
            } else {
              res.send({ msg: false });
            }
          }
        }
      );
    } else {
      res.send({ msg: false });
    }
  } catch (error) {
    
    res.send({ msg: "User not found" });
  }
};

const createUser = async (req, res) => {
  try {
    bcrypt.hash(req.body.UserPassword, 8, async function (err, hash) {
      if (err) {
        res.send(err);
      } else {
        // Configuration
        cloudinary.config({
          cloud_name: "dzmsvqlan",
          api_key: "919678929551622",
          api_secret: "-hAqCncdd0RMb2jzCealDRYZYAU",
        });

        // const file = req.files.UserPhoto; //This is used when you have to upload the files from thunderClient
        const file = req.body.UserPhoto; //This is my jugaad

        const response = cloudinary.uploader.upload(
          file.tempFilePath,
          async (error, result) => {
            const data = {
              UserName: req.body.UserName,
              UserEmail: req.body.UserEmail,
              UserMobile: req.body.UserMobile,
              UserPassword: hash,
              UserDOB: req.body.UserDOB,
              UserStatus: "active",
              // UserPhoto: result.secure_url,
              UserPhoto: req.body.UserPhoto,
            };

            // const result = new User({UserName,UserEmail,UserMobile,UserPassword,UserDOB})
            const finalresult = new User(data);
            await finalresult.save();
            console.log(data);
            res
              .status(201)
              .send({ msg: "New User Inserted...", user: finalresult });
            // await sendMailFun(
            //   req.body.UserEmail,
            //   req.body.subject,
            //   result.secure_url
            // );
          }
        ); //!Here the cloudinary uploader ends.upload ends
      }
    });
  } catch (error) {
    // res.status(201).send("Message sent...");
    
    res.send(error);
  }
};

const updateUser = async (authData, req, res) => {
  try {
    //Hash if User enters the password in update
    if (req.body.UserPassword) {
      try {
        const hash = await bcrypt.hash(req.body.UserPassword, 8);
        req.body.UserPassword = hash;
      } catch (err) {
        res.send(err);
      }
    }
    const userInfo = await User.findByIdAndUpdate(authData.userId, req.body, {
      new: true,
    });
    if (userInfo) {
      // console.log(userInfo);
      res.send({ msg: true, user: userInfo });
    }
  } catch (error) {
    res.send({ msg: false });
   
  }
};

const deleteUser = async (req, res) => {
  // console.log(`User ID: ${req.params.id}`);
  try {
    const userData = await User.findByIdAndDelete(req.params.id);
    res.send("Deleted....");
    // console.log(`Deleted ${req.params.id}`);
  } catch (error) {
    // console.log("Error:", error);
  }
};

module.exports = {
  checkLogin,
  allUsers,
  createUser,
  updateUser,
  deleteUser,
  profile,
};
