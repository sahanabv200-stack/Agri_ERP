const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./purchase.controller");

router.get("/transactions", auth, authorize("purchase.transaction.read"), asyncHandler(controller.listPurchases));
router.get("/transactions/:id", auth, authorize("purchase.transaction.read"), asyncHandler(controller.getPurchase));
router.post("/transactions", auth, authorize("purchase.transaction.create"), asyncHandler(controller.createPurchase));
router.put("/transactions/:id", auth, authorize("purchase.transaction.update"), asyncHandler(controller.updatePurchase));
router.delete("/transactions/:id", auth, authorize("purchase.transaction.delete"), asyncHandler(controller.deletePurchase));

router.get("/orders", auth, authorize("purchase.transaction.read"), asyncHandler(controller.listPurchaseOrders));
router.post("/orders", auth, authorize("purchase.transaction.create"), asyncHandler(controller.createPurchaseOrder));
router.put("/orders/:id", auth, authorize("purchase.transaction.update"), asyncHandler(controller.updatePurchaseOrder));
router.delete("/orders/:id", auth, authorize("purchase.transaction.delete"), asyncHandler(controller.deletePurchaseOrder));

module.exports = router;
