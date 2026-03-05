import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function GstConfig() {
  return (
    <CrudPage
      title="GST Configuration"
      endpoint="/admin/gst-configs"
      columns={[
        { key: "id", label: "ID" },
        { key: "commodity_name", label: "Commodity" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "hsn", label: "HSN" },
        { key: "cgst_pct", label: "CGST %" },
        { key: "sgst_pct", label: "SGST %" },
        { key: "igst_pct", label: "IGST %" },
        { key: "effective_from", label: "Effective From" },
        { key: "is_active", label: "Active" },
      ]}
      formFields={[
        { key: "commodity_id", label: "Commodity ID (optional)" },
        { key: "hsn", label: "HSN" },
        { key: "cgst_pct", label: "CGST %" },
        { key: "sgst_pct", label: "SGST %" },
        { key: "igst_pct", label: "IGST %" },
        { key: "effective_from", label: "Effective From (YYYY-MM-DD)" },
        { key: "is_active", label: "Active (1/0)" },
      ]}
      defaultValues={{
        cgst_pct: 0,
        sgst_pct: 0,
        igst_pct: 0,
        is_active: 1,
      }}
    />
  );
}
