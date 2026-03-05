import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Transporters() {
  return (
    <CrudPage
      title="Transporters"
      endpoint="/masters/transporters"
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
      ]}
      formFields={[
        { key: "name", label: "Transporter Name" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
      ]}
      defaultValues={{}}
    />
  );
}