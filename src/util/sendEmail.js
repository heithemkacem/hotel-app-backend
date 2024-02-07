const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"joejoejoem5@gmail.com",
    pass: "uclx gkdi jrmm vziq",
  },
});

// Testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to go from NodeMailer");
    console.log(success);
  }
});
const sendEmail = async (mailOptions) => {
  try {
    const emailSent = await transporter.sendMail(mailOptions);
    return emailSent;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
