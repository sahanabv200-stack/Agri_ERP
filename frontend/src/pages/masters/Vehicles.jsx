import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Vehicles() {
  return (
    <CrudPage
      title="Vehicles"
      endpoint="/masters/vehicles"
      columns={[
        { key: "id", label: "ID" },
        { key: "vehicle_no", label: "Vehicle No" },
        { key: "transporter_id", label: "Transporter ID" },
        { key: "driver_name", label: "Driver" },
        { key: "driver_phone", label: "Driver Phone" },
      ]}
      formFields={[
        { key: "vehicle_no", label: "Vehicle No" },
        { key: "transporter_id", label: "Transporter ID (optional)" },
        { key: "driver_name", label: "Driver Name" },
        { key: "driver_phone", label: "Driver Phone" },
      ]}
      defaultValues={{}}
    />
  );
}