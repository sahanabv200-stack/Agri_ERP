import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Batches() {
  return (
    <CrudPage
      title="Stock Batches"
      endpoint="/inventory/batches"
      columns={[
        { key: "id", label: "ID" },
        { key: "batch_no", label: "Batch No" },
        { key: "warehouse_name", label: "Warehouse" },
        { key: "commodity_name", label: "Commodity" },
        { key: "bags", label: "Bags" },
        { key: "quantity_kg", label: "Qty" },
        { key: "available_kg", label: "Available" },
      ]}
      formFields={[
        { key: "batch_no", label: "Batch No" },
        { key: "warehouse_id", label: "Warehouse ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "purchase_id", label: "Purchase ID (optional)" },
        { key: "bags", label: "Bags" },
        { key: "quantity_kg", label: "Quantity KG" },
      ]}
      defaultValues={{
        bags: 0,
      }}
    />
  );
}