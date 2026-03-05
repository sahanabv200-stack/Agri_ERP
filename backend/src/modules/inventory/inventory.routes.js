const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const batch = require("./stockBatch.controller");
const transfer = require("./transfer.controller");

router.get("/batches", auth, authorize("inventory.batch.read"), asyncHandler(batch.list));
router.post("/batches", auth, authorize("inventory.batch.create"), asyncHandler(batch.create));
router.put("/batches/:id", auth, authorize("inventory.batch.update"), asyncHandler(batch.update));
router.delete("/batches/:id", auth, authorize("inventory.batch.delete"), asyncHandler(batch.remove));

router.get("/transfers", auth, authorize("inventory.transfer.read"), asyncHandler(transfer.list));
router.post("/transfers", auth, authorize("inventory.transfer.create"), asyncHandler(transfer.create));
router.put("/transfers/:id", auth, authorize("inventory.transfer.update"), asyncHandler(transfer.update));
router.delete("/transfers/:id", auth, authorize("inventory.transfer.delete"), asyncHandler(transfer.remove));

module.exports = router;
