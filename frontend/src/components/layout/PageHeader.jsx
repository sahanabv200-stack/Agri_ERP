import React from "react";
import { useLocation } from "react-router-dom";

function toLabel(part) {
  return part
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function PageHeader({ title, subtitle = "", actions }) {
  const location = useLocation();
  const parts = location.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const crumbs = ["Home", ...parts.map(toLabel)];

  return (
    <div className="mb-4">
      <div className="text-xs text-slate-500">{crumbs.join(" / ")}</div>
      <div className="mt-1 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
        </div>
        <div>{actions}</div>
      </div>
    </div>
  );
}
