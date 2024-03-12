const express = require("express");
const router = express.Router();
const { CreateService } = require("./controller");

// Using built-in express.json() middleware
router.use(express.json());

router.post("/service", async (req, res) => {
  try {
    await CreateService(req, res);
  } catch (error) {
    console.error("Error in roomservice route:", error);
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});

module.exports = router;
