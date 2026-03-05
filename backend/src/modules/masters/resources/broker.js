const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "brokers",
  idField: "id",
  allowedFields: ["name", "phone", "commission_pct", "address", "is_active"],
  searchFields: ["name", "phone"],
});
