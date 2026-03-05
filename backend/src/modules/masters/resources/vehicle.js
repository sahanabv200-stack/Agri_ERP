const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "vehicles",
  idField: "id",
  allowedFields: ["vehicle_no", "transporter_id", "driver_name", "driver_phone"],
  searchFields: ["vehicle_no", "driver_name", "driver_phone"],
});
