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

//Admin Get All Hotels
router.get("/hotels", async (req, res) => {
  try {
    const allHotels = await getAllHotels();
    const {
      _id,
      hotelName,
      hotelAddress,
      hotelCity,
      hotelDescription,
      hotelEmail,
      hotelPhone,
      hotelPrice,
      hotelImage,
      hotelStars,
      hotelRooms,
    } = allHotels;
    res.json({
      status: "Success",
      message: "Hotels Found",
      hotels: {
        _id,
        hotelName,
        hotelAddress,
        hotelCity,
        hotelDescription,
        hotelEmail,
        hotelPhone,
        hotelPrice,
        hotelImage,
        hotelStars,
        hotelRooms,
      },
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
//Admin Delete Hotel
router.delete("/delete-hotel/:id", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.id);
    res.json({
      status: "Success",
      message: "Hotel Deleted",
      hotel: deletedHotel,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
//Admin Update Hotel
router.put("/update-hotel/:id", async (req, res) => {
  try {
    const { error } = hotelRegisterValidation(req.body);
    if (error) {
      throw new Error(error["details"][0]["message"]);
    }
    const updatedHotel = await updateHotel(req.params.id, req.body);
    res.json({
      status: "Success",
      message: "Hotel Updated",
      hotel: updatedHotel,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
