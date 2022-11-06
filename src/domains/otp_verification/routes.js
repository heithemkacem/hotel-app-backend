const express = require("express");
const router = express.Router();
const {
  verifyOTPEmail,
  resendOTP,
  verifyOTPModifyPassword,
} = require("./controller");
//! Still Not Tested need testes
//Verify OTP For Modify Password
router.post("/verify-modify-password", async (req, res) => {
  const { otp, id } = req.body;
  //transform id to string
  try {
    await verifyOTPModifyPassword(id, otp);
    res.json({
      status: "Success",
      message: "You can set your new password now",
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

//!Verify email
router.post("/verify", async (req, res) => {
  const { otp, id } = req.body;
  //transform id to string
  try {
    await verifyOTPEmail(id, otp);
    res.json({
      status: "Success",
      message: "You account has been verified",
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

// Get User ID From Route
// Check the type of user ID
router.post("/resendOTP", async (req, res) => {
  try {
    let { id, email } = req.body;

    const resendEmail = await resendOTP(id, email);
    if (resendEmail === true) {
      res.json({
        status: "Success",
        message: "OTP has been resent",
      });
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
