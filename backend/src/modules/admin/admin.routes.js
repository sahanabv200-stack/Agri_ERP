const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./admin.controller");

router.get("/company", auth, authorize("reports.read"), asyncHandler(controller.getCompany));
router.put("/company", auth, authorize("reports.read"), asyncHandler(controller.updateCompany));

router.get("/users", auth, authorize("reports.read"), asyncHandler(controller.listUsers));
router.post("/users", auth, authorize("reports.read"), asyncHandler(controller.createUser));
router.put("/users/:id", auth, authorize("reports.read"), asyncHandler(controller.updateUser));
router.delete("/users/:id", auth, authorize("reports.read"), asyncHandler(controller.deleteUser));

router.get("/roles", auth, authorize("reports.read"), asyncHandler(controller.listRoles));
router.get("/permissions", auth, authorize("reports.read"), asyncHandler(controller.listPermissions));
router.get("/roles/:code/permissions", auth, authorize("reports.read"), asyncHandler(controller.getRolePermissions));
router.put("/roles/:code/permissions", auth, authorize("reports.read"), asyncHandler(controller.updateRolePermissions));
router.post("/roles/assign-defaults", auth, authorize("reports.read"), asyncHandler(controller.assignDefaultRolePermissions));

router.get("/financial-years", auth, authorize("reports.read"), asyncHandler(controller.listFinancialYears));
router.post("/financial-years", auth, authorize("reports.read"), asyncHandler(controller.createFinancialYear));
router.put("/financial-years/:id", auth, authorize("reports.read"), asyncHandler(controller.updateFinancialYear));
router.delete("/financial-years/:id", auth, authorize("reports.read"), asyncHandler(controller.deleteFinancialYear));

router.get("/gst-configs", auth, authorize("reports.read"), asyncHandler(controller.listGstConfigs));
router.post("/gst-configs", auth, authorize("reports.read"), asyncHandler(controller.createGstConfig));
router.put("/gst-configs/:id", auth, authorize("reports.read"), asyncHandler(controller.updateGstConfig));
router.delete("/gst-configs/:id", auth, authorize("reports.read"), asyncHandler(controller.deleteGstConfig));

router.get("/commodity-prices", auth, authorize("reports.read"), asyncHandler(controller.listCommodityPrices));
router.post("/commodity-prices", auth, authorize("reports.read"), asyncHandler(controller.createCommodityPrice));
router.put("/commodity-prices/:id", auth, authorize("reports.read"), asyncHandler(controller.updateCommodityPrice));
router.delete("/commodity-prices/:id", auth, authorize("reports.read"), asyncHandler(controller.deleteCommodityPrice));

module.exports = router;
