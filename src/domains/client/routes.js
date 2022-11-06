//Express Router
const express = require("express");
const router = express.Router();
const { clientRegisterValidation } = require("./../../util/clientVerification");
const {
  createClient,
  clientForgetPassword,
  ResetPassword,
} = require("./controller");
//Passport
const passport = require("passport");
const { strategy } = require("./../../security/strategy");
const Client = require("./model");
router.use(passport.initialize());
passport.use(strategy);

// Client Inscription
router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, email, phone, password } = req.body;
  try {
    const { error } = clientRegisterValidation(req.body);
    if (error) {
      res.send({ status: "Failed", message: error["details"][0]["message"] });
    } else {
      const createdClient = await createClient({
        username,
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      res.json({
        status: "Success",
        message: "Client created successfully",
        client: createdClient,
      });
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

// User Auth

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    const fetchedUser = await clientForgetPassword(email);
    res.json({
      status: "Success",
      message: "Verification Email Was Sent",
      id: fetchedUser._id,
      email: email,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, email } = req.body;
    if (newPassword != confirmNewPassword) {
      throw Error("Passwords must match");
    } else {
      const updatedUser = await ResetPassword(email, newPassword);
      res.send(updatedUser);
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

// User change password from dashboard
router.post(
  "/reset_password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id, oldPassword, newPassword, confirmNewPassword } = req.body;
      const hashedPassword = await hashData(newPassword);
      Client.findOne({ _id: id })
        .then(async function (user) {
          if (!user) {
            res.json({
              status: "Failed",
              message: "common:email_does_not_exist",
            });
          } else {
            if (newPassword == oldPassword) {
              res.json({
                status: "Failed",
                message: "common:new_password_is_the_same_as_old_password",
              });
            } else if (newPassword != confirmNewPassword) {
              res.json({
                status: "Failed",
                message:
                  "common:new_password_and_confirm_new_password_are_not_same",
              });
            } else {
              const ComparedPassword = await verifyHashedData(
                oldPassword,
                user.password
              );
              if (ComparedPassword == true) {
                Client.updateOne({ password: hashedPassword }, { _id: id });
                res.json({
                  status: "Success",
                  message: "common:Password changed",
                });
              } else {
                res.json({
                  status: "Failed",
                  message: "common:old_password_is_incorrect",
                });
              }
            }
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      res.json({
        status: "Failed",
        message: error.message,
      });
    }
  }
);

module.exports = router;
