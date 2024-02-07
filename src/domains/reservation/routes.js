

const express = require("express");
const router = express.Router();
const { makeReservation } = require("./controller");

// Using built-in express.json() middleware
router.use(express.json());
 const passport = require("passport");
const { strategy } = require("./../../security/strategy");

router.use(passport.initialize());
passport.use(strategy);
router.post("/reserve", async (req, res) => {
  try {
    console.log("Received a reservation request:", req.body);

    // Call the makeReservation function
    await makeReservation(req, res);

  } catch (error) {
    console.error("Error in reservation route:", error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
