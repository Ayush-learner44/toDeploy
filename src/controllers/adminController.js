const Admin = require("../models/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const admin_key = "thisistheadminkey";

const allAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find({}, { token: 0 });

    res.status(200).send(adminData);
  } catch (error) {
    // console.log("Error:", error);
  }
};

const checkAdminLogin = async (req, res) => {
  const aid = req.body.AdminId;
  const pass = req.body.AdminPassword;
  try {
    const adminData = await Admin.findOne({ AdminId: aid });

    // if(adminData){
    //   console.log("Admin Login Done")
    // }
    bcrypt.compare(pass, adminData.AdminPassword, async function (err, result) {
      if (result) {
        const adminId = adminData._id;
        jwt.sign(
          { id },
          admin_key,
          { expiresIn: "5min" },
          async function (err, token) {
            res.send({ msg: true, token: token });
            adminData.token = token;
            await adminData.save();
          }
        );
      } else {
        res.status(200).send({ msg: false });
      }
    });
  } catch (error) {
    res.status(200).send({ msg: false });
  }
};

const createAdmin = async (req, res) => {
  try {
    bcrypt.hash(req.body.AdminPassword, 8, async function (err, hash) {
      if (err) {
        res.send(err);
      } else {
        const data = {
          AdminId: req.body.AdminId,
          AdminPassword: hash,
        };

        const finalresult = new Admin(data);
        await finalresult.save();
        res.send(finalresult);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  allAdmins,
  createAdmin,
  checkAdminLogin,
};
