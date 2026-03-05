import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Payments() {
  return (
    <CrudPage
      title="Payments"
      endpoint="/accounts/payments"
      columns={[
        { key: "id", label: "ID" },
        { key: "payment_date", label: "Date" },
        { key: "paid_to_ledger_id", label: "Ledger ID" },
        { key: "paid_to", label: "Paid To" },
        { key: "amount", label: "Amount" },
        { key: "mode", label: "Mode" },
        { key: "reference_no", label: "Reference" },
        { key: "narration", label: "Narration" },
      ]}
      formFields={[
        { key: "payment_date", label: "Payment Date" },
        { key: "paid_to_ledger_id", label: "Paid To Ledger ID" },
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
