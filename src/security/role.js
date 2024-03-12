const jwt = require("jsonwebtoken");
const Client = require("../domains/ClientRoutes/model");
const Hotel = require("../domains/HotelRoutes/model");
const Admin = require("../domains/AdminRoutes/model");

const checkRole = (entity, roles) => async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token missing" });

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Token verification failed" });
    }

    // If verification succeeds, attach the decoded token to the request for further processing
    req.user = decoded;

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

    try {
      // Retrieve user info from DB
      const user = await Model.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Check if user's role is allowed
      if (!roles.includes(user.role)) {
        return res
          .status(401)
          .json("Sorry, you do not have access to this route");
      }

      // Role is allowed, proceed to next middleware
      next();
    } catch (error) {
      console.error("Error retrieving user from database:", error.message);
      return res.status(500).json("Internal server error");
    }
  });
};

module.exports = checkRole;
