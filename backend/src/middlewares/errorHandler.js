/* eslint-disable no-unused-vars */
const { badRequest } = require("../utils/apiResponse");

module.exports = function errorHandler(err, req, res, next) {
  if (err?.name === "ZodError") {
    return badRequest(res, "Validation failed", err.issues);
  }
  if (err?.code && String(err.code).startsWith("ER_")) {
    return res.status(400).json({ success: false, message: "Database error", details: err.code });
  }
  console.error("ERROR:", err);
  return res.status(500).json({ success: false, message: "Internal Server Error" });
};
