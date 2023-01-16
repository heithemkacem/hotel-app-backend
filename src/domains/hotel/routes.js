//Express Router
const express = require("express");
const router = express.Router();
//Passport
const passport = require("passport");
const { strategy } = require("./../../security/strategy");
const {
  GetHotelById,
  getAllHotels,
  updateHotel,
  deleteHotel,
} = require("./controller");
router.use(passport.initialize());
passport.use(strategy);
router.post("/findHotel", async (req, res) => {
  try {
    const { id } = req.body;
    const foundedHotel = await GetHotelById(id);
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
    } = foundedHotel;
    res.json({
      status: "Success",
      message: "Hotel Found",
      hotel: {
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
//Admin Get All Hotels
router.get("/hotels", async (req, res) => {
  try {
    const allHotels = await getAllHotels();

    if (allHotels !== null) {
      res.json({
        status: "Success",
        message: "Hotels Found",
        hotels: allHotels,
      });
    } else {
      res.json({
        status: "Success",
        message: "No Hotels Found",
        hotels: [],
      });
    }
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
