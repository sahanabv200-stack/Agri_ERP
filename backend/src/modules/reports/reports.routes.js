const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./reports.controller");

router.get("/purchase", auth, authorize("reports.read"), asyncHandler(controller.purchaseReport));
router.get("/sales", auth, authorize("reports.read"), asyncHandler(controller.salesReport));
router.get("/stock", auth, authorize("reports.read"), asyncHandler(controller.stockReport));
router.get("/outstanding", auth, authorize("reports.read"), asyncHandler(controller.outstandingReport));
router.get("/profit-loss", auth, authorize("reports.read"), asyncHandler(controller.profitLossReport));
router.get("/dashboard-summary", auth, authorize("reports.read"), asyncHandler(controller.dashboardSummary));

module.exports = router;
