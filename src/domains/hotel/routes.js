//Express Router
const express = require("express");
const router = express.Router();
//Passport
const passport = require("passport");
const { strategy } = require("./../../security/strategy");
router.use(passport.initialize());
passport.use(strategy);

module.exports = router;
