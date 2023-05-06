const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Admin = require("../controllers/adminController");
const Course = require("../controllers/courseController");

const auth_key = "thisistheadminkey"

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

router.get("/", Admin.allAdmins)

router.post("/adminLogin", Admin.checkAdminLogin);

router.get("/authAdmin", extractToken, (req, res) => {
  jwt.verify(req.token, auth_key, (err, authData) => {
    console.log("authData : ", authData);
    if (err) {
      res.send({ msg: "Error" });
    } else {
      res.json({ msg: "token found", authData });
    }
  });
});

router.post("/createAdmin", Admin.createAdmin);


module.exports = router;
