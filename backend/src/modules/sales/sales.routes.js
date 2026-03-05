const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./sales.controller");

router.get("/orders", auth, authorize("sales.order.read"), asyncHandler(controller.listOrders));
router.post("/orders", auth, authorize("sales.order.create"), asyncHandler(controller.createOrder));
router.put("/orders/:id", auth, authorize("sales.order.update"), asyncHandler(controller.updateOrder));
router.delete("/orders/:id", auth, authorize("sales.order.delete"), asyncHandler(controller.deleteOrder));

router.get("/invoices", auth, authorize("sales.invoice.read"), asyncHandler(controller.listInvoices));
router.post("/invoices", auth, authorize("sales.invoice.create"), asyncHandler(controller.createInvoice));
router.put("/invoices/:id", auth, authorize("sales.invoice.update"), asyncHandler(controller.updateInvoice));
router.delete("/invoices/:id", auth, authorize("sales.invoice.delete"), asyncHandler(controller.deleteInvoice));

module.exports = router;
