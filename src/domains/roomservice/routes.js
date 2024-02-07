

const express = require("express");
const router = express.Router();
const { makeService } = require("./controller");

// Using built-in express.json() middleware
router.use(express.json());
 const passport = require("passport");
const { strategy } = require("./../../security/strategy");

router.use(passport.initialize());
passport.use(strategy);
router.post("/service", async (req, res) => {
  try {
    console.log("Received a roomserive request:", req.body);

    // Call the makeReservation function
    await makeService(req, res);

  } catch (error) {
    console.error("Error in roomservice route:", error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
