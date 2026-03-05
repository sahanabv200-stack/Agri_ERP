const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");
const controller = require("./accounts.controller");

router.get("/ledgers", auth, authorize("accounts.ledger.read"), asyncHandler(controller.listLedgers));
router.post("/ledgers", auth, authorize("accounts.ledger.create"), asyncHandler(controller.createLedger));
router.put("/ledgers/:id", auth, authorize("accounts.ledger.update"), asyncHandler(controller.updateLedger));
router.delete("/ledgers/:id", auth, authorize("accounts.ledger.delete"), asyncHandler(controller.deleteLedger));

router.get("/payments", auth, authorize("accounts.payment.read"), asyncHandler(controller.listPayments));
router.post("/payments", auth, authorize("accounts.payment.create"), asyncHandler(controller.createPayment));
router.put("/payments/:id", auth, authorize("accounts.payment.update"), asyncHandler(controller.updatePayment));
router.delete("/payments/:id", auth, authorize("accounts.payment.delete"), asyncHandler(controller.deletePayment));

router.get("/receipts", auth, authorize("accounts.receipt.read"), asyncHandler(controller.listReceipts));
router.post("/receipts", auth, authorize("accounts.receipt.create"), asyncHandler(controller.createReceipt));
router.put("/receipts/:id", auth, authorize("accounts.receipt.update"), asyncHandler(controller.updateReceipt));
router.delete("/receipts/:id", auth, authorize("accounts.receipt.delete"), asyncHandler(controller.deleteReceipt));

module.exports = router;
