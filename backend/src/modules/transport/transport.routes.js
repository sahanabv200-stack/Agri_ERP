const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./transport.controller");

router.get("/dispatches", auth, authorize("transport.dispatch.read"), asyncHandler(controller.list));
router.post("/dispatches", auth, authorize("transport.dispatch.create"), asyncHandler(controller.create));
router.put("/dispatches/:id", auth, authorize("transport.dispatch.update"), asyncHandler(controller.update));
router.delete("/dispatches/:id", auth, authorize("transport.dispatch.delete"), asyncHandler(controller.remove));
router.post("/dispatches/:id/confirm", auth, authorize("transport.dispatch.update"), asyncHandler(controller.confirmDelivery));

module.exports = router;
