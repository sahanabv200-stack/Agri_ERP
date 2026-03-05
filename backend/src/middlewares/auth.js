const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { unauthorized } = require("../utils/apiResponse");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return unauthorized(res, "Missing Authorization token");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return unauthorized(res, "Invalid or expired token");
  }
};
