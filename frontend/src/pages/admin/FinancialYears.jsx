import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function FinancialYears() {
  return (
    <CrudPage
      title="Financial Year Setup"
      endpoint="/admin/financial-years"
      columns={[
        { key: "id", label: "ID" },
        { key: "code", label: "FY Code" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "is_active", label: "Active" },
      ]}
      formFields={[
        { key: "code", label: "Code (e.g. FY2026-27)" },
        { key: "start_date", label: "Start Date (YYYY-MM-DD)" },
        { key: "end_date", label: "End Date (YYYY-MM-DD)" },
        { key: "is_active", label: "Active (1/0)" },
      ]}
      defaultValues={{ is_active: 0 }}
    />
  );
}
