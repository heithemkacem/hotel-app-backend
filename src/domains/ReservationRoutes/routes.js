const express = require("express");
const router = express.Router();
const { CreateReservation } = require("./controller");
router.use(express.json());
router.post("/reserve", async (req, res) => {
  try {
    await CreateReservation(req, res);
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
