const express = require("express");
const PrivateRoute = require("../../security/strategy");
const router = express.Router();
router.use(express.json());
router.post("/chat", PrivateRoute, async (req, res) => {
  try {
    console.log("Chat:", req.body);
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});
module.exports = router;
