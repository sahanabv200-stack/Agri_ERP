import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Dispatches() {
  return (
    <CrudPage
      title="Dispatches"
      endpoint="/transport/dispatches"
      columns={[
        { key: "id", label: "ID" },
        { key: "dispatch_date", label: "Date" },
        { key: "sales_invoice_id", label: "Sales Invoice ID" },
        { key: "transporter_name", label: "Transporter" },
        { key: "vehicle_number", label: "Vehicle" },
        { key: "from_warehouse_name", label: "From Warehouse" },
        { key: "to_location", label: "To Location" },
        { key: "freight_charge", label: "Freight Charge" },
      ]}
      formFields={[
        { key: "dispatch_date", label: "Dispatch Date" },
        { key: "sales_invoice_id", label: "Sales Invoice ID" },
        { key: "transporter_id", label: "Transporter ID" },
        { key: "vehicle_id", label: "Vehicle ID" },
        { key: "from_warehouse_id", label: "From Warehouse ID" },
        { key: "to_location", label: "To Location" },
        { key: "freight_charge", label: "Freight Charge" },
      ]}
      defaultValues={{
        freight_charge: 0,
      }}
    />
  );
}