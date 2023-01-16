//Express Router
const express = require("express");
const router = express.Router();
//Passport
const passport = require("passport");
const { strategy } = require("./../../security/strategy");
const { GetHotelById } = require("./controller");
router.use(passport.initialize());
passport.use(strategy);
router.post("/findHotel", async (req, res) => {
  try {
    const { id } = req.body;
    const foundedHotel = await GetHotelById(id);
    const {
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
    } = foundedHotel;
    res.json({
      status: "Success",
      message: "Hotel Found",
      hotel: {
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
module.exports = router;
