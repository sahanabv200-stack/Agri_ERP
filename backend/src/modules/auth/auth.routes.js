const router = require("express").Router();
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./auth.controller");
const auth = require("../../middlewares/auth");

router.post("/login", asyncHandler(controller.login));
router.get("/me", auth, asyncHandler(controller.me));

module.exports = router;
