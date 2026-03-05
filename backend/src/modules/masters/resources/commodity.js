const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "commodities",
  idField: "id",
  allowedFields: ["name", "code", "unit", "hsn", "is_active"],
  searchFields: ["name", "code", "hsn"],
});
