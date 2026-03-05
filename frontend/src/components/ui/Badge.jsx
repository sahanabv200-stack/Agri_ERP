import React from "react";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  OPEN: "bg-sky-50 text-sky-700 border-sky-100",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  DRAFT: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export default function Badge({ value }) {
  const text = String(value ?? "");
  const key = text.toUpperCase();
  const className = STATUS_STYLES[key] || "bg-slate-100 text-slate-700 border-slate-200";

  return <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium ${className}`}>{text}</span>;
}
