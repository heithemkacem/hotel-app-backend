//Express Router
const express = require("express");
const router = express.Router();
const {
  adminRegisterValidation,
  LoginValidation,
} = require("./DTO/adminVerification");
const {
  hotelRegisterValidation,
} = require("../HotelRoutes/DTO/hotelVerification");
const {
  createAdmin,
  authenticate,
  createHotel,
  getAllUsers,
} = require("./controller");
const PrivateRoute = require("./../../security/strategy");
const checkRole = require("./../../security/role");
const multer = require("multer");
const upload = multer();
const { v4: uuidv4 } = require("uuid");

// Admin Inscription
router.post("/signup", checkRole("admin", ["ADMIN"]), async (req, res) => {
  const { username, firstName, lastName, email, password, phone } = req.body;
  try {
    const { error } = adminRegisterValidation(req.body);
    if (error) {
      res.send({ status: "Failed", message: error["details"][0]["message"] });
    } else {
      const createdAdmin = await createAdmin({
        username,
        firstName,
        lastName,
        email,
        password,
        phone,
      });
      res.json({
        status: "Success",
        message: "Admin created successfully",
        admin: createdAdmin,
      });
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

//Auth
router.post("/auth", async (req, res) => {
  const { credentials, deviceId } = req.body;
  const { email, password } = credentials;
  try {
    const { error } = LoginValidation({ email, password });
    if (error) {
      res.send({ status: "Failed", message: error["details"][0]["message"] });
    } else {
      const authenticated = await authenticate(email, password, deviceId);
      res.json(authenticated);
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
router.post("/create-hotel", async (req, res) => {
  try {
    const { error } = hotelRegisterValidation(req.body);
    if (error) {
      return res.json({
        status: "Failed",
        message: error.details[0].message,
      });
    }
    const createdHotel = await createHotel(req.body);
    res.json({
      status: "Success",
      message: "Hotel created successfully",
      hotel: createdHotel,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});
// getall users
router.get("/users", checkRole("admin", ["ADMIN"]), async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    if (allUsers !== null) {
      res.json({
        status: "Success",
        message: "Users Found",
        users: allUsers,
      });
    } else {
      res.json({
        status: "Success",
        message: "No Users Found",
        users: [],
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
