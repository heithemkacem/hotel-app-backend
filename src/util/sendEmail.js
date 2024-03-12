const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
