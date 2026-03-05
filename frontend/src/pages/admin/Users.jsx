import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function Users() {
  return (
    <CrudPage
      title="Users Management"
      endpoint="/admin/users"
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "role_code", label: "Role" },
        { key: "is_active", label: "Active" },
      ]}
      formFields={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "password", label: "Password (required for new user)" },
        { key: "roleCode", label: "Role Code (ADMIN/PURCHASE/SALES/etc)" },
        { key: "isActive", label: "Active (1/0)" },
      ]}
      defaultValues={{ isActive: 1 }}
    />
  );
}
