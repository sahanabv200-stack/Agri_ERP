import React from "react";

export default function Select({ label, options = [], error = "", className = "", ...props }) {
  return (
    <label className="block">
      {label ? <div className="text-xs font-medium text-slate-500 mb-1.5">{label}</div> : null}
      <select
        {...props}
        className={`w-full px-3 py-2.5 rounded-xl border bg-white/90 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-100 ${error ? "border-rose-300" : "border-slate-200"} ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <div className="text-xs text-rose-600 mt-1">{error}</div> : null}
    </label>
  );
}
