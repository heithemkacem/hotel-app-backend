//Express Router
const express = require("express");
const router = express.Router();

const {
  GetHotelById,
  GetUsersByOTP,
  getAllHotels,
  updateHotel,
  deleteHotel,
  getHotelByOTP,
} = require("./controller");
const PrivateRoute = require("../../security/strategy");
const checkRole = require("../../security/role");
const e = require("express");

router.post("/findHotelOtp", PrivateRoute, async (req, res) => {
  try {
    const { otp } = req.body;
    const foundedHotel = await getHotelByOTP(otp);
    if (foundedHotel) {
      res.json({
        status: "Success",
        message: "Hotel Found",
        hotel: foundedHotel,
      });
    } else {
      throw Error("Hotel Not Found");
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

router.post("/findHotel", PrivateRoute, async (req, res) => {
  try {
    const { id } = req.body;
    const foundedHotel = await GetHotelById(id);
    res.json({
      status: "Success",
      message: "Hotel Found",
      hotel: foundedHotel,
    });
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
//Admin Get All Hotels
router.get("/hotels", checkRole("admin", ["ADMIN"]), async (req, res) => {
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
//usersbyottp
router.post("/userHotel", checkRole("hotel", ["HOTEL"]), async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await GetUsersByOTP(otp);
    if (!user) {
      return res.status(404).json({ error: "User not found. Check the OTP." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
//Admin Delete Hotel
router.delete(
  "/delete-hotel/:id",
  checkRole("admin", ["ADMIN"]),
  async (req, res) => {
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
  }
);
//Admin Update Hotel
router.put("/update-hotel/:id", PrivateRoute, async (req, res) => {
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
