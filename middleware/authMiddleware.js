// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

// ─── Protect Middleware ───────────────────────────────────────────────────────
// Attach this to any route that requires login
// Usage: router.get('/profile', protect, getProfile)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Tokens are sent in the Authorization header as: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // extract the token part
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    // Verify the token using our secret
    // If token is expired or tampered, this throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object (minus password)
    // Now every route handler can access req.user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized — user not found");
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error("Your account has been deactivated");
    }

    next(); // user is authenticated — proceed to route handler
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized — invalid token");
  }
});

// ─── Admin Middleware ─────────────────────────────────────────────────────────
// Use AFTER protect — checks if the logged-in user is an admin
// Usage: router.delete('/users/:id', protect, admin, deleteUser)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // user is admin — proceed
  } else {
    res.status(403);
    throw new Error("Not authorized — admin access required");
  }
};

module.exports = { protect, admin };
