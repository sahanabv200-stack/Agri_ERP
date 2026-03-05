import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Transfers() {
  return (
    <CrudPage
      title="Warehouse Transfers"
      endpoint="/inventory/transfers"
      columns={[
        { key: "id", label: "ID" },
        { key: "transfer_date", label: "Date" },
        { key: "from_name", label: "From" },
        { key: "to_name", label: "To" },
        { key: "commodity_name", label: "Commodity" },
        { key: "quantity_kg", label: "Qty" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { key: "transfer_date", label: "Transfer Date (YYYY-MM-DD)" },
        { key: "from_warehouse_id", label: "From Warehouse ID" },
        { key: "to_warehouse_id", label: "To Warehouse ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "quantity_kg", label: "Quantity KG" },
        { key: "notes", label: "Notes" },
      ]}
      defaultValues={{}}
    />
  );
}