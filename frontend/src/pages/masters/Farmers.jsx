    import React from "react";
    import CrudPage from "../_shared/CrudPage";

    export default function Farmers() {
      return (
        <CrudPage
          title="Farmers"
          endpoint="/masters/farmers"
          columns={[
  {
    "key": "id",
    "label": "ID"
  },
  {
    "key": "name",
    "label": "Name"
  },
  {
    "key": "village",
    "label": "Village"
  },
  {
    "key": "phone",
    "label": "Phone"
  },
  {
    "key": "aadhaar",
    "label": "Aadhaar"
  },
  {
    "key": "is_active",
    "label": "Active"
  }
]}
          formFields={[
  {
    "key": "name",
    "label": "Farmer Name"
  },
  {
    "key": "village",
    "label": "Village"
  },
  {
    "key": "phone",
    "label": "Mobile"
  },
  {
    "key": "aadhaar",
    "label": "Aadhaar"
  },
  {
    "key": "bank_name",
    "label": "Bank"
  },
  {
    "key": "bank_account",
    "label": "Account No"
  },
  {
    "key": "ifsc",
    "label": "IFSC"
  },
  {
    "key": "is_active",
    "label": "Active (1/0)"
  }
]}
          defaultValues={{ is_active: 1 }}
        />
      );
    }
