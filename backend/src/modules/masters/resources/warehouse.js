const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "warehouses",
  idField: "id",
  allowedFields: ["name", "location", "capacity_kg"],
  searchFields: ["name", "location"],
});
