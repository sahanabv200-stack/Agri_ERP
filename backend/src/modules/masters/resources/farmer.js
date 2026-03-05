const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "farmers",
  idField: "id",
  allowedFields: ["name", "village", "aadhaar", "phone", "address", "bank_name", "bank_account", "ifsc", "is_active"],
  searchFields: ["name", "village", "aadhaar", "phone"],
});
