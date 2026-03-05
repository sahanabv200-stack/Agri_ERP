    import React from "react";
    import CrudPage from "../_shared/CrudPage";

    export default function Warehouses() {
      return (
        <CrudPage
          title="Warehouses"
          endpoint="/masters/warehouses"
          columns={[
  {
    "key": "id",
    "label": "ID"
  },
  {
    "key": "name",
    "label": "Name"
  },
  {
    "key": "location",
    "label": "Location"
  },
  {
    "key": "capacity_kg",
    "label": "Capacity (KG)"
  }
]}
          formFields={[
  {
    "key": "name",
    "label": "Warehouse Name"
  },
  {
    "key": "location",
    "label": "Location"
  },
  {
    "key": "capacity_kg",
    "label": "Capacity KG"
  }
]}
          defaultValues={{ capacity_kg: 0 }}
        />
      );
    }
