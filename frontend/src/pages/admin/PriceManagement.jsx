import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function PriceManagement() {
  return (
    <CrudPage
      title="Price Management"
      endpoint="/admin/commodity-prices"
      columns={[
        { key: "id", label: "ID" },
        { key: "commodity_name", label: "Commodity" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "price_type", label: "Price Type" },
        { key: "rate", label: "Rate" },
        { key: "effective_date", label: "Effective Date" },
        { key: "notes", label: "Notes" },
      ]}
      formFields={[
        { key: "commodity_id", label: "Commodity ID" },
        { key: "price_type", label: "Price Type (PURCHASE/SALE)" },
        { key: "rate", label: "Rate" },
        { key: "effective_date", label: "Effective Date (YYYY-MM-DD)" },
        { key: "notes", label: "Notes" },
      ]}
      defaultValues={{ price_type: "PURCHASE" }}
    />
  );
}
