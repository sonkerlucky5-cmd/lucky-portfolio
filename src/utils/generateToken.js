const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
