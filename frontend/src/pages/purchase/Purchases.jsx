import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Purchases() {
  return (
    <CrudPage
      title="Purchases"
      endpoint="/purchase/transactions"
      columns={[
        { key: "id", label: "ID" },
        { key: "purchase_date", label: "Date" },
        { key: "farmer_name", label: "Farmer" },
        { key: "commodity_name", label: "Commodity" },
        { key: "quantity_kg", label: "Qty KG" },
        { key: "rate", label: "Rate" },
        { key: "total_payable", label: "Total" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { key: "purchase_date", label: "Purchase Date (YYYY-MM-DD)" },
        { key: "farmer_id", label: "Farmer ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "quantity_kg", label: "Quantity KG" },
        { key: "rate", label: "Rate" },
        { key: "moisture_pct", label: "Moisture %" },
        { key: "quality_grade", label: "Quality Grade" },
        { key: "commission_amount", label: "Commission" },
        { key: "total_payable", label: "Total Payable" },
        { key: "notes", label: "Notes" },
      ]}
      defaultValues={{
        moisture_pct: 0,
        commission_amount: 0,
      }}
    />
  );
}