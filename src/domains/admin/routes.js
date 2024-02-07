//Express Router
const express = require("express");
const router = express.Router();
const {
  adminRegisterValidation,
  LoginValidation,
} = require("./../../util/adminVerification");
const { hotelRegisterValidation } = require("./../../util/hotelVerification");
const {
  createAdmin,
  authenticate,
  createHotel,
  getAllUsers,
  getAllHotels,
  deleteHotel,
  updateHotel,
} = require("./controller");
//Passport
const passport = require("passport");
const { strategy } = require("./../../security/strategy");
router.use(passport.initialize());
passport.use(strategy);

// Admin Inscription
router.post("/signup", async (req, res) => {
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

// Admin Auth
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = LoginValidation(req.body);
    if (error) {
      res.send({ status: "Failed", message: error["details"][0]["message"] });
    } else {
      const authenticated = await authenticate(email, password);
      res.json(authenticated);
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

// Admin Inscription
router.post("/create-hotel", async (req, res) => {
  const {
    hotelName,
    hotelAddress,
    hotelCity,
    hotelStars,
    hotelRooms,
    hotelPrice,
    hotelDescription,
    hotelImage,
    hotelPhone,
    hotelEmail,
    password,
  } = req.body;
  try {
    const { error } = hotelRegisterValidation(req.body);
    if (error) {
      res.send({ status: "Failed", message: error["details"][0]["message"] });
    } else {
      const createdHotel = await createHotel({
        hotelName,
        hotelAddress,
        hotelCity,
        hotelStars,
        hotelRooms,
        hotelPrice,
        hotelDescription,
        hotelImage,
        hotelPhone,
        hotelEmail,
        password,
      });
      res.json({
        status: "Success",
        message: "Hotel created successfully",
        admin: createdHotel,
      });
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
// getall users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await getAllUsers();
console.log("hellll")
    if (allUsers !== null) {
      res.json({
        status: "Success",
        message: "users Found",
        users: allUsers,
      });
    } else {
      res.json({
        status: "Success",
        message: "No users Found",
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
