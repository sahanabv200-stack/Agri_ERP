import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function SalesOrders() {
  return (
    <CrudPage
      title="Sales Orders"
      endpoint="/sales/orders"
      columns={[
        { key: "id", label: "ID" },
        { key: "order_date", label: "Date" },
        { key: "customer_name", label: "Customer" },
        { key: "commodity_name", label: "Commodity" },
        { key: "quantity_kg", label: "Qty" },
        { key: "rate", label: "Rate" },
        { key: "status", label: "Status" },
        { key: "discount_amount", label: "Discount" },
      ]}
      formFields={[
        { key: "order_date", label: "Order Date" },
        { key: "customer_id", label: "Customer ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "quantity_kg", label: "Quantity KG" },
        { key: "rate", label: "Rate" },
        { key: "broker_id", label: "Broker ID (optional)" },
        { key: "discount_amount", label: "Discount" },
        { key: "notes", label: "Notes" },
      ]}
      defaultValues={{
        discount_amount: 0,
      }}
    />
  );
}