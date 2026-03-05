const { createCrudController } = require("../crudFactory");

module.exports = createCrudController({
  table: "transporters",
  idField: "id",
  allowedFields: ["name", "phone", "address"],
  searchFields: ["name", "phone"],
});
