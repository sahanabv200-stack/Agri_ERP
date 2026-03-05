import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function PurchaseOrders() {
  return (
    <CrudPage
      title="Purchase Orders"
      endpoint="/purchase/orders"
      columns={[
        { key: "id", label: "ID" },
        { key: "order_date", label: "Order Date" },
        { key: "farmer_id", label: "Farmer ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "expected_qty_kg", label: "Expected Qty KG" },
        { key: "expected_rate", label: "Expected Rate" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { key: "order_date", label: "Order Date (YYYY-MM-DD)" },
        { key: "farmer_id", label: "Farmer ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "expected_qty_kg", label: "Expected Qty KG" },
        { key: "expected_rate", label: "Expected Rate" },
        { key: "status", label: "Status (OPEN/CLOSED)" },
      ]}
      defaultValues={{ status: "OPEN" }}
    />
  );
}
