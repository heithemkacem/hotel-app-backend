const express = require("express");
const router = express.Router();

const AdminRoutes = require("./../domains/admin");
const HotelRoutes = require("./../domains/hotel");
const ClientRoutes = require("./../domains/client");
const OTPRoutes = require("./../domains/otp_verification");

router.use("/admin", AdminRoutes);
router.use("/hotel", HotelRoutes);
router.use("/client", ClientRoutes);
router.use("/otp", OTPRoutes);

module.exports = router;
