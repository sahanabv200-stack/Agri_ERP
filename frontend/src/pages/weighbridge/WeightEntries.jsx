import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function WeightEntries() {
  return (
    <CrudPage
      title="Weighbridge Entries"
      endpoint="/weighbridge/entries"
      columns={[
        { key: "id", label: "ID" },
        { key: "entry_date", label: "Entry Date" },
        { key: "vehicle_no", label: "Vehicle" },
        { key: "commodity_name", label: "Commodity" },
        { key: "gross_weight_kg", label: "Gross" },
        { key: "tare_weight_kg", label: "Tare" },
        { key: "net_weight_kg", label: "Net" },
        { key: "status", label: "Status" },
      ]}
      formFields={[
        { key: "entry_date", label: "Entry DateTime (YYYY-MM-DD HH:MM:SS)" },
        { key: "vehicle_id", label: "Vehicle ID" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "gross_weight_kg", label: "Gross KG" },
        { key: "tare_weight_kg", label: "Tare KG" },
        { key: "slip_no", label: "Slip No" },
      ]}
      defaultValues={{
        gross_weight_kg: 0,
        tare_weight_kg: 0,
      }}
    />
  );
}