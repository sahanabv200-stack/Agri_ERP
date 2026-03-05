import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Commodities() {
  return (
    <CrudPage
      title="Commodities"
      endpoint="/masters/commodities"
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "unit", label: "Unit" },
        { key: "hsn", label: "HSN" },
        { key: "is_active", label: "Active" },
      ]}
      formFields={[
        { key: "name", label: "Commodity Name" },
        { key: "code", label: "Code" },
        { key: "unit", label: "Unit (KG/BAG)" },
        { key: "hsn", label: "HSN" },
        { key: "is_active", label: "Active (1/0)" },
      ]}
      defaultValues={{
        unit: "KG",
        is_active: 1,
      }}
    />
  );
}