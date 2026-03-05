const router = require("express").Router();
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const asyncHandler = require("../../utils/asyncHandler");

const commodity = require("./resources/commodity");
const farmer = require("./resources/farmer");
const customer = require("./resources/customer");
const broker = require("./resources/broker");
const warehouse = require("./resources/warehouse");
const transporter = require("./resources/transporter");
const vehicle = require("./resources/vehicle");

router.get("/commodities", auth, authorize("masters.commodity.read"), asyncHandler(commodity.list));
router.get("/commodities/:id", auth, authorize("masters.commodity.read"), asyncHandler(commodity.get));
router.post("/commodities", auth, authorize("masters.commodity.create"), asyncHandler(commodity.create));
router.put("/commodities/:id", auth, authorize("masters.commodity.update"), asyncHandler(commodity.update));
router.delete("/commodities/:id", auth, authorize("masters.commodity.delete"), asyncHandler(commodity.remove));

router.get("/farmers", auth, authorize("masters.farmer.read"), asyncHandler(farmer.list));
router.get("/farmers/:id", auth, authorize("masters.farmer.read"), asyncHandler(farmer.get));
router.post("/farmers", auth, authorize("masters.farmer.create"), asyncHandler(farmer.create));
router.put("/farmers/:id", auth, authorize("masters.farmer.update"), asyncHandler(farmer.update));
router.delete("/farmers/:id", auth, authorize("masters.farmer.delete"), asyncHandler(farmer.remove));

router.get("/customers", auth, authorize("masters.customer.read"), asyncHandler(customer.list));
router.get("/customers/:id", auth, authorize("masters.customer.read"), asyncHandler(customer.get));
router.post("/customers", auth, authorize("masters.customer.create"), asyncHandler(customer.create));
router.put("/customers/:id", auth, authorize("masters.customer.update"), asyncHandler(customer.update));
router.delete("/customers/:id", auth, authorize("masters.customer.delete"), asyncHandler(customer.remove));

router.get("/brokers", auth, authorize("masters.broker.read"), asyncHandler(broker.list));
router.get("/brokers/:id", auth, authorize("masters.broker.read"), asyncHandler(broker.get));
router.post("/brokers", auth, authorize("masters.broker.create"), asyncHandler(broker.create));
router.put("/brokers/:id", auth, authorize("masters.broker.update"), asyncHandler(broker.update));
router.delete("/brokers/:id", auth, authorize("masters.broker.delete"), asyncHandler(broker.remove));

router.get("/warehouses", auth, authorize("masters.warehouse.read"), asyncHandler(warehouse.list));
router.get("/warehouses/:id", auth, authorize("masters.warehouse.read"), asyncHandler(warehouse.get));
router.post("/warehouses", auth, authorize("masters.warehouse.create"), asyncHandler(warehouse.create));
router.put("/warehouses/:id", auth, authorize("masters.warehouse.update"), asyncHandler(warehouse.update));
router.delete("/warehouses/:id", auth, authorize("masters.warehouse.delete"), asyncHandler(warehouse.remove));

router.get("/transporters", auth, authorize("masters.transporter.read"), asyncHandler(transporter.list));
router.get("/transporters/:id", auth, authorize("masters.transporter.read"), asyncHandler(transporter.get));
router.post("/transporters", auth, authorize("masters.transporter.create"), asyncHandler(transporter.create));
router.put("/transporters/:id", auth, authorize("masters.transporter.update"), asyncHandler(transporter.update));
router.delete("/transporters/:id", auth, authorize("masters.transporter.delete"), asyncHandler(transporter.remove));

router.get("/vehicles", auth, authorize("masters.vehicle.read"), asyncHandler(vehicle.list));
router.get("/vehicles/:id", auth, authorize("masters.vehicle.read"), asyncHandler(vehicle.get));
router.post("/vehicles", auth, authorize("masters.vehicle.create"), asyncHandler(vehicle.create));
router.put("/vehicles/:id", auth, authorize("masters.vehicle.update"), asyncHandler(vehicle.update));
router.delete("/vehicles/:id", auth, authorize("masters.vehicle.delete"), asyncHandler(vehicle.remove));

module.exports = router;
