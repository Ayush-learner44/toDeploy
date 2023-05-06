const User = require("../models/UserModel");
const nodemailer = require("nodemailer");

const owner = "ayushstudent120@gmail.com";
const pin = "nztrgxukqqgzkbio";

// async..await is not allowed in global scope, must use a wrapper
async function sendMailFun(req, res) {
  const sendTo = req.body.sendTo;

  const user = await User.findOne({ UserEmail: sendTo });

  if (!user) {
    res.send({ msg: false, });
  } else {
    // send mail with defined transport object
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      // secure: true,
      auth: {
        user: owner, // generated ethereal user
        pass: pin, //
      },
      host: "smtp.gmail.com",
    });

    let mailOptions = {
      from: owner, // sender address
      to: `${req.body.sendTo}`, // list of receivers
      subject: "working", // Subject line
      text: `Your password is nothings`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    };

    try {
      const msg = await transporter.sendMail(mailOptions);
      res.send({ msg: true, eid: req.body.sendTo });
      console.log("Message:" + msg.response);
    } catch (error) {
      res.send({ msg: false });
      console.log("Error:", error);
    }
  }
}

module.exports = sendMailFun;
