// utils/generateToken.js

const jwt = require("jsonwebtoken");

// Takes a user ID and returns a signed JWT token
// This token is sent to the client and stored (localStorage or cookie)
// Every protected request must include this token
const generateToken = id => {
  return jwt.sign(
    { id }, // payload — what we store IN the token
    process.env.JWT_SECRET, // secret key — used to sign & verify
    { expiresIn: process.env.JWT_EXPIRE || "30d" }, // token expires in 30 days
  );
};

module.exports = generateToken;
