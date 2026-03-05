import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Ledgers() {
  return (
    <CrudPage
      title="Ledgers"
      endpoint="/accounts/ledgers"
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Ledger Name" },
        { key: "type", label: "Type" },
        { key: "opening_balance", label: "Opening" },
        { key: "ref_type", label: "Ref Type" },
        { key: "ref_id", label: "Ref ID" },
      ]}
      formFields={[
        { key: "name", label: "Ledger Name" },
        { key: "type", label: "Type (ASSET/LIABILITY/INCOME/EXPENSE)" },
        { key: "opening_balance", label: "Opening Balance" },
        { key: "ref_type", label: "Ref Type (FARMER/CUSTOMER/BROKER/etc)" },
        { key: "ref_id", label: "Ref ID" },
      ]}
      defaultValues={{}}
    />
  );
}