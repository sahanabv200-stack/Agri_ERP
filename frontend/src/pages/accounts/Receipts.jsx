import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Receipts() {
  return (
    <CrudPage
      title="Receipts"
      endpoint="/accounts/receipts"
      columns={[
        { key: "id", label: "ID" },
        { key: "receipt_date", label: "Date" },
        { key: "received_from_ledger_id", label: "Ledger ID" },
        { key: "received_from", label: "Received From" },
        { key: "amount", label: "Amount" },
        { key: "mode", label: "Mode" },
        { key: "reference_no", label: "Reference" },
        { key: "narration", label: "Narration" },
      ]}
      formFields={[
        { key: "receipt_date", label: "Receipt Date" },
        { key: "received_from_ledger_id", label: "Received From Ledger ID" },
        { key: "amount", label: "Amount" },
        { key: "mode", label: "Mode (CASH/BANK/UPI)" },
        { key: "reference_no", label: "Reference No" },
        { key: "narration", label: "Narration" },
      ]}
      defaultValues={{
        mode: "CASH",
      }}
    />
  );
}
