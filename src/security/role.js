const Client = require("../domains/ClientRoutes/model");
const Hotel = require("../domains/HotelRoutes/model");
const Admin = require("../domains/AdminRoutes/model");

const checkRole = (entity, roles) => async (req, res, next) => {
  let { email } = req.body;
  let Model;

  // Determine which model to use based on the entity
  switch (entity) {
    case "client":
      Model = Client;
      break;
    case "hotel":
      Model = Hotel;
      break;
    case "admin":
      Model = Admin;
      break;
    default:
      return res.status(500).json("Invalid entity specified");
  }

  // Retrieve user info from DB
  const user = await Model.findOne({ email });
  if (!user) {
    return res.status(404).json("User not found");
  }

  // Check if user's role is allowed
  if (!roles.includes(user.role)) {
    return res.status(401).json("Sorry, you do not have access to this route");
  }

  // Role is allowed, proceed to next middleware
  next();
};

module.exports = checkRole;
