    import React from "react";
    import CrudPage from "../_shared/CrudPage";

    export default function Customers() {
      return (
        <CrudPage
          title="Customers"
          endpoint="/masters/customers"
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
    "key": "phone",
    "label": "Phone"
  },
  {
    "key": "gstin",
    "label": "GSTIN"
  },
  {
    "key": "is_active",
    "label": "Active"
  }
]}
          formFields={[
  {
    "key": "name",
    "label": "Customer Name"
  },
  {
    "key": "phone",
    "label": "Phone"
  },
  {
    "key": "email",
    "label": "Email"
  },
  {
    "key": "gstin",
    "label": "GSTIN"
  },
  {
    "key": "address",
    "label": "Address"
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
