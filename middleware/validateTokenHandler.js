const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user details to request object
    req.user = decoded.user;

    next(); // Move to next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
});

module.exports = validateToken;
