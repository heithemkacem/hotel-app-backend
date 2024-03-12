const jwt = require("jsonwebtoken");

const PrivateRoute = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Token missing" });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Token verification failed" });
    }

    // If verification succeeds, attach the decoded token to the request for further processing
    req.user = decoded;
    next();
  });
};

module.exports = PrivateRoute;
