const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.PASSWORD,
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
