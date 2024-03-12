const express = require("express");
const router = express.Router();
const { CreateReservation } = require("./controller");
const checkRole = require("../../security/role");
router.use(express.json());
router.post("/reserve", checkRole("client", ["CLIENT"]), async (req, res) => {
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
