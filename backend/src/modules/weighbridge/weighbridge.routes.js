const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./weighbridge.controller");

router.get("/entries", auth, authorize("weighbridge.entry.read"), asyncHandler(controller.list));
router.get("/entries/:id", auth, authorize("weighbridge.entry.read"), asyncHandler(controller.get));
router.post("/entries", auth, authorize("weighbridge.entry.create"), asyncHandler(controller.create));
router.put("/entries/:id", auth, authorize("weighbridge.entry.update"), asyncHandler(controller.update));
router.delete("/entries/:id", auth, authorize("weighbridge.entry.delete"), asyncHandler(controller.remove));

module.exports = router;
