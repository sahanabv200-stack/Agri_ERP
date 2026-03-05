import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Brokers() {
  return (
    <CrudPage
      title="Brokers"
      endpoint="/masters/brokers"
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "commission_pct", label: "Commission %" },
        { key: "is_active", label: "Active" },
      ]}
      formFields={[
        { key: "name", label: "Broker Name" },
        { key: "phone", label: "Phone" },
        { key: "commission_pct", label: "Commission %" },
        { key: "address", label: "Address" },
        { key: "is_active", label: "Active (1/0)" },
      ]}
      defaultValues={{
        commission_pct: 0,
        is_active: 1,
      }}
    />
  );
}