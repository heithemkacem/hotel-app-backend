const Hotel = require("./model");
const verifyHashedData = require("./../../util/verifyHashedData");
const { ROLES } = require("./../../security/role");
const jwt = require("jsonwebtoken");

module.exports = { authenticateHotel };
