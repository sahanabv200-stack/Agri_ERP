import React from "react";
import CrudPage from "../_shared/CrudPage";

export default function SalesInvoices() {
  return (
    <CrudPage
      title="Sales Invoices"
      endpoint="/sales/invoices"
      columns={[
        { key: "id", label: "ID" },
        { key: "invoice_no", label: "Invoice No" },
        { key: "invoice_date", label: "Date" },
        { key: "customer_name", label: "Customer" },
        { key: "commodity_name", label: "Commodity" },
        { key: "total_amount", label: "Total" },
        { key: "gst_pct", label: "GST %" },
      ]}
      formFields={[
        { key: "invoice_no", label: "Invoice No" },
        { key: "invoice_date", label: "Invoice Date" },
        { key: "customer_id", label: "Customer ID" },
        { key: "sales_order_id", label: "Sales Order ID (optional)" },
        { key: "commodity_id", label: "Commodity ID" },
        { key: "quantity_kg", label: "Quantity KG" },
        { key: "rate", label: "Rate" },
        { key: "gst_pct", label: "GST %" },
      ]}
      defaultValues={{
        gst_pct: 0,
      }}
    />
  );
}