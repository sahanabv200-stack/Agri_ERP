const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "customers",
  idField: "id",
  allowedFields: ["name", "phone", "email", "gstin", "address", "is_active"],
  searchFields: ["name", "phone", "email", "gstin"],
});
